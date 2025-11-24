import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOpenCodeClient } from '@/api/opencode'
import { useCreateSession } from '@/hooks/useOpenCode'
import type { components } from '@/api/opencode-types'

type CommandType = components['schemas']['Command']

interface CommandHandlerProps {
  opcodeUrl: string
  sessionID: string
  directory?: string
  onShowSessionsDialog?: () => void
  onShowModelsDialog?: () => void
  onShowHelpDialog?: () => void
}

export function useCommandHandler({
  opcodeUrl,
  sessionID,
  directory,
  onShowSessionsDialog,
  onShowModelsDialog,
  onShowHelpDialog
}: CommandHandlerProps) {
  const navigate = useNavigate()
  const createSession = useCreateSession(opcodeUrl, directory)
  const [loading, setLoading] = useState(false)

  const executeCommand = useCallback(async (command: CommandType) => {
    if (!opcodeUrl) return

    setLoading(true)
    
    try {
      const client = createOpenCodeClient(opcodeUrl, directory)
      
      // Handle special commands that need UI interaction
      switch (command.name) {
        case 'sessions':
        case 'resume':
        case 'continue':
          onShowSessionsDialog?.()
          break
          
        case 'models':
          onShowModelsDialog?.()
          break
          
        case 'themes':
          // Themes command will be sent to server and appear as message
          await client.sendCommand(sessionID, {
            command: command.name,
            arguments: ''
          })
          break
          
        case 'help':
          onShowHelpDialog?.()
          break
          
case 'new':
        case 'clear':
          // Create a new session and navigate to it
          try {
            const newSession = await createSession.mutateAsync({
              agent: undefined
            })
            if (newSession?.id) {
              // Navigate to the correct repo session URL pattern
              // We need to get the current repo ID from the URL
              const currentPath = window.location.pathname
              const repoMatch = currentPath.match(/\/repos\/(\d+)\/sessions\//)
              if (repoMatch) {
                const repoId = repoMatch[1]
                const newPath = `/repos/${repoId}/sessions/${newSession.id}`
                navigate(newPath)
              } else {
                // Fallback: try to navigate to session directly if route exists
                navigate(`/session/${newSession.id}`)
              }
            }
          } catch (error) {
            console.error('Failed to create new session:', error)
          }
          break
          
        case 'share':
        case 'unshare':
        case 'export':
        case 'compact':
        case 'summarize':
        case 'undo':
        case 'redo':
        case 'details':
        case 'editor':
        case 'init':
          // These commands will be sent to the server and appear as messages
          await client.sendCommand(sessionID, {
            command: command.name,
            arguments: ''
          })
          break
          
        default:
          // Send custom commands to server
          await client.sendCommand(sessionID, {
            command: command.name,
            arguments: ''
          })
      }
    } catch (error) {
      console.error('Failed to execute command:', error)
    } finally {
      setLoading(false)
    }
  }, [sessionID, opcodeUrl, onShowSessionsDialog, onShowModelsDialog, onShowHelpDialog, createSession, navigate])

  return {
    executeCommand,
    loading
  }
}