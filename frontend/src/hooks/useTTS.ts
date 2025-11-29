import { useState, useRef, useCallback, useEffect } from 'react'
import { useSettings } from './useSettings'
import { API_BASE_URL } from '@/config'

const TTS_CACHE_NAME = 'tts-audio-cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

async function generateCacheKey(text: string, voice: string, model: string, speed: number): Promise<string> {
  const data = `${text}|${voice}|${model}|${speed}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getCachedAudio(cacheKey: string): Promise<Blob | null> {
  try {
    const cache = await caches.open(TTS_CACHE_NAME)
    const response = await cache.match(cacheKey)
    
    if (!response) return null
    
    const cachedAt = response.headers.get('x-cached-at')
    if (cachedAt && Date.now() - parseInt(cachedAt) > CACHE_TTL_MS) {
      await cache.delete(cacheKey)
      return null
    }
    
    return await response.blob()
  } catch {
    return null
  }
}

async function cacheAudio(cacheKey: string, blob: Blob): Promise<void> {
  try {
    const cache = await caches.open(TTS_CACHE_NAME)
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'x-cached-at': Date.now().toString(),
    })
    const response = new Response(blob, { headers })
    await cache.put(cacheKey, response)
  } catch {
    // Cache API not available, continue without caching
  }
}

export type TTSState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export function useTTS() {
  const { preferences } = useSettings()
  const [state, setState] = useState<TTSState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [currentText, setCurrentText] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const ttsConfig = preferences?.tts
  const isEnabled = ttsConfig?.enabled && ttsConfig?.apiKey

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const speak = useCallback(async (text: string) => {
    if (!isEnabled || !ttsConfig) {
      setError('TTS is not configured')
      setState('error')
      return
    }

    cleanup()
    setError(null)
    setCurrentText(text)
    setState('loading')

    try {
      const { voice, model, speed } = ttsConfig
      const cacheKey = await generateCacheKey(text, voice, model, speed)
      
      let audioBlob = await getCachedAudio(cacheKey)
      
      if (!audioBlob) {
        abortControllerRef.current = new AbortController()
        
        const response = await fetch(`${API_BASE_URL}/api/tts/synthesize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'TTS request failed')
        }

        audioBlob = await response.blob()
        await cacheAudio(cacheKey, audioBlob)
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setState('playing')
      audio.onpause = () => {
        if (audio.currentTime < audio.duration) {
          setState('paused')
        }
      }
      audio.onended = () => {
        setState('idle')
        setCurrentText(null)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setError('Audio playback failed')
        setState('error')
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setState('idle')
        return
      }
      setError(err instanceof Error ? err.message : 'TTS failed')
      setState('error')
    }
  }, [isEnabled, ttsConfig, cleanup])

  const stop = useCallback(() => {
    cleanup()
    setState('idle')
    setCurrentText(null)
    setError(null)
  }, [cleanup])

  const pause = useCallback(() => {
    if (audioRef.current && state === 'playing') {
      audioRef.current.pause()
    }
  }, [state])

  const resume = useCallback(() => {
    if (audioRef.current && state === 'paused') {
      audioRef.current.play()
    }
  }, [state])

  const toggle = useCallback(() => {
    if (state === 'playing') {
      pause()
    } else if (state === 'paused') {
      resume()
    }
  }, [state, pause, resume])

  return {
    speak,
    stop,
    pause,
    resume,
    toggle,
    state,
    error,
    currentText,
    isEnabled,
    isPlaying: state === 'playing',
    isLoading: state === 'loading',
    isPaused: state === 'paused',
    isIdle: state === 'idle',
  }
}
