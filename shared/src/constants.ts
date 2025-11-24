import { config } from 'dotenv'
import path from 'path'
import os from 'os'
config({ path: '../.env' })

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key]
  return value ? parseInt(value, 10) : defaultValue
}

const workspaceBasePath = process.env.WORKSPACE_PATH 
  ? path.resolve(process.env.WORKSPACE_PATH)
  : path.join(os.homedir(), '.opencode-workspace')

export const WORKSPACE = {
  BASE_PATH: workspaceBasePath,
  REPOS_DIR: 'repos',
  CONFIG_DIR: 'config',
  AUTH_FILE: '.opencode/state/opencode/auth.json',
} as const

export const getWorkspacePath = () => WORKSPACE.BASE_PATH
export const getReposPath = () => path.join(WORKSPACE.BASE_PATH, WORKSPACE.REPOS_DIR)
export const getConfigPath = () => path.join(WORKSPACE.BASE_PATH, WORKSPACE.CONFIG_DIR)
export const getAuthPath = () => path.join(WORKSPACE.BASE_PATH, WORKSPACE.AUTH_FILE)

export const TIMEOUTS = {
  PROCESS_START_WAIT_MS: getEnvNumber('PROCESS_START_WAIT_MS', 2000),
  PROCESS_VERIFY_WAIT_MS: getEnvNumber('PROCESS_VERIFY_WAIT_MS', 1000),
  HEALTH_CHECK_INTERVAL_MS: getEnvNumber('HEALTH_CHECK_INTERVAL_MS', 5000),
  HEALTH_CHECK_TIMEOUT_MS: getEnvNumber('HEALTH_CHECK_TIMEOUT_MS', 30000),
} as const

const maxFileSizeMB = getEnvNumber('MAX_FILE_SIZE_MB', 50)
const maxUploadSizeMB = getEnvNumber('MAX_UPLOAD_SIZE_MB', 50)

export const FILE_LIMITS = {
  MAX_SIZE_BYTES: maxFileSizeMB * 1024 * 1024,
  MAX_UPLOAD_SIZE_BYTES: maxUploadSizeMB * 1024 * 1024,
} as const

export const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'text/typescript',
  'application/json',
  'application/xml',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/zip',
] as const

export const GIT_PROVIDERS = {
  GITHUB: 'github.com',
  GITLAB: 'gitlab.com',
  BITBUCKET: 'bitbucket.org',
} as const
