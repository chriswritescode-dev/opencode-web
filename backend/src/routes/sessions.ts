import { Hono } from 'hono'
import { logger } from '../utils/logger'
import { ENV } from '../config'

const OPENCODE_SERVER_PORT = ENV.OPENCODE_SERVER_PORT

export function createSessionRoutes() {
  const app = new Hono()

  app.post('/', async (c) => {
    const body = await c.req.json()
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        logger.error(`Session creation failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Session creation failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to create session:', error)
      return c.json({ error: 'Failed to create session' }, 500)
    }
  })

  app.post('/:sessionID/command', async (c) => {
    const sessionID = c.req.param('sessionID')
    const body = await c.req.json()
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session/${sessionID}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        logger.error(`Command failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Command failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to send command:', error)
      return c.json({ error: 'Failed to send command' }, 500)
    }
  })

  app.post('/:sessionID/shell', async (c) => {
    const sessionID = c.req.param('sessionID')
    const body = await c.req.json()
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session/${sessionID}/shell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        logger.error(`Shell command failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Shell command failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to send shell command:', error)
      return c.json({ error: 'Failed to send shell command' }, 500)
    }
  })

  app.post('/:sessionID/abort', async (c) => {
    const sessionID = c.req.param('sessionID')
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session/${sessionID}/abort`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        logger.error(`Abort failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Abort failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to abort session:', error)
      return c.json({ error: 'Failed to abort session' }, 500)
    }
  })

  app.get('/:sessionID/message', async (c) => {
    const sessionID = c.req.param('sessionID')
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session/${sessionID}/message`)
      
      if (!response.ok) {
        logger.error(`Get messages failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Get messages failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to get messages:', error)
      return c.json({ error: 'Failed to get messages' }, 500)
    }
  })

  app.post('/:sessionID/message', async (c) => {
    const sessionID = c.req.param('sessionID')
    const body = await c.req.json()
    
    try {
      const response = await fetch(`http://localhost:${OPENCODE_SERVER_PORT}/session/${sessionID}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        logger.error(`Send message failed: ${response.status} ${response.statusText}`)
        return c.json({ error: 'Send message failed', status: response.status }, response.status as any)
      }
      
      const data = await response.json()
      return c.json(data)
    } catch (error) {
      logger.error('Failed to send message:', error)
      return c.json({ error: 'Failed to send message' }, 500)
    }
  })
  
  return app
}
