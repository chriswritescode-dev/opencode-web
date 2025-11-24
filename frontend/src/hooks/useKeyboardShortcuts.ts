import { useEffect, useCallback } from 'react'
import { useSettings } from './useSettings'

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

const normalizeShortcut = (shortcut: string): string => {
  // Convert stored shortcuts to platform-specific format for comparison
  return shortcut.replace(/Cmd/g, isMac ? 'Cmd' : 'Ctrl')
}

const parseEventShortcut = (e: KeyboardEvent): string => {
  const keys = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.metaKey) keys.push('Cmd')
  if (e.altKey) keys.push('Alt')
  if (e.shiftKey) keys.push('Shift')
  
  const mainKey = e.key
  if (!['Control', 'Meta', 'Alt', 'Shift'].includes(mainKey)) {
    let displayKey = mainKey
    if (mainKey === ' ') displayKey = 'Space'
    else if (mainKey === 'ArrowUp') displayKey = 'Up'
    else if (mainKey === 'ArrowDown') displayKey = 'Down'
    else if (mainKey === 'ArrowLeft') displayKey = 'Left'
    else if (mainKey === 'ArrowRight') displayKey = 'Right'
    else if (mainKey === 'Enter') displayKey = 'Return'
    else if (mainKey === 'Escape') displayKey = 'Esc'
    else if (mainKey === 'Tab') displayKey = 'Tab'
    else if (mainKey === 'Backspace') displayKey = 'Backspace'
    else if (mainKey === 'Delete') displayKey = 'Delete'
    else if (mainKey.length === 1) displayKey = mainKey.toUpperCase()
    
    keys.push(displayKey)
    return keys.join('+')
  }
  return ''
}

interface ShortcutActions {
  openModelDialog?: () => void
  openSessions?: () => void
  sessions?: () => void
  newSession?: () => void
  closeSession?: () => void
  toggleSidebar?: () => void
  submitPrompt?: () => void
  abortSession?: () => void
  toggleMode?: () => void
  undo?: () => void
  redo?: () => void
  compact?: () => void
  fork?: () => void
  openSettings?: () => void
}

export function useKeyboardShortcuts(actions: ShortcutActions = {}) {
  const { preferences } = useSettings()

  

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const shortcut = parseEventShortcut(e)
    if (!shortcut) return

    const shortcuts = preferences?.keyboardShortcuts || {}
    
    // Check if any file editor is active on the page
    const activeFileEditor = document.querySelector('[data-file-editor="true"]')
    if (activeFileEditor && document.activeElement === activeFileEditor) {
      return // Block all shortcuts when a file editor is active
    }
    
    // Don't trigger shortcuts when user is typing in input fields or editing files
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true' || target.getAttribute('data-file-editor') === 'true') {
      // Allow some shortcuts to work even in input fields (but not in file editor)
      const allowedInInput = ['submit', 'abort', 'toggleMode']
      const isFileEditor = target.getAttribute('data-file-editor') === 'true'
      const action = Object.entries(shortcuts).find(([, keys]) => normalizeShortcut(keys) === shortcut)?.[0]
      if (!action || !allowedInInput.includes(action) || isFileEditor) {
        return
      }
    }

    // Find the action that matches the current shortcut
    const action = Object.entries(shortcuts).find(([, keys]) => normalizeShortcut(keys) === shortcut)?.[0]
    
    if (!action) return

    switch (action) {
      case 'selectModel':
        e.preventDefault()
        actions.openModelDialog?.()
        break
      case 'sessions':
        e.preventDefault()
        actions.openSessions?.()
        break
      case 'newSession':
        e.preventDefault()
        actions.newSession?.()
        break
      case 'closeSession':
        e.preventDefault()
        actions.closeSession?.()
        break
      case 'toggleSidebar':
        e.preventDefault()
        actions.toggleSidebar?.()
        break
      case 'submit':
        e.preventDefault()
        actions.submitPrompt?.()
        break
      case 'abort':
        e.preventDefault()
        actions.abortSession?.()
        break
      case 'toggleMode':
        e.preventDefault()
        actions.toggleMode?.()
        break
      case 'undo':
        e.preventDefault()
        actions.undo?.()
        break
      case 'redo':
        e.preventDefault()
        actions.redo?.()
        break
      case 'compact':
        e.preventDefault()
        actions.compact?.()
        break
      case 'fork':
        e.preventDefault()
        actions.fork?.()
        break
      case 'settings':
        e.preventDefault()
        actions.openSettings?.()
        break
    }
  }, [preferences?.keyboardShortcuts, actions])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}