import { spawn, type ChildProcess } from 'child_process'
import { logger } from './logger'

export async function executeCommand(
  args: string[],
  cwd?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const [command, ...cmdArgs] = args
    
    const proc: ChildProcess = spawn(command || '', cmdArgs, {
      cwd,
      shell: false
    })

    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    proc.on('error', (error: Error) => {
      logger.error(`Command failed: ${args.join(' ')}`, error)
      reject(error)
    })

    proc.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        const error = new Error(`Command failed with code ${code}: ${stderr || stdout}`)
        logger.error(`Command failed: ${args.join(' ')}`, error)
        reject(error)
      }
    })
  })
}
