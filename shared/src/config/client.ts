import { DEFAULTS, ALLOWED_MIME_TYPES, GIT_PROVIDERS } from './defaults'

export interface ClientConfig {
  API_BASE_URL: string
  SERVER_PORT: number
  OPENCODE_PORT: number
  FILE_LIMITS: {
    MAX_SIZE_BYTES: number
    MAX_UPLOAD_SIZE_BYTES: number
  }
}

export function createClientConfig(env: {
  VITE_API_URL?: string
  VITE_SERVER_PORT?: string
  VITE_OPENCODE_PORT?: string
  VITE_MAX_FILE_SIZE_MB?: string
  VITE_MAX_UPLOAD_SIZE_MB?: string
}): ClientConfig {
  const maxFileSizeMB = env.VITE_MAX_FILE_SIZE_MB 
    ? parseInt(env.VITE_MAX_FILE_SIZE_MB, 10) 
    : DEFAULTS.FILE_LIMITS.MAX_SIZE_MB
  
  const maxUploadSizeMB = env.VITE_MAX_UPLOAD_SIZE_MB 
    ? parseInt(env.VITE_MAX_UPLOAD_SIZE_MB, 10) 
    : DEFAULTS.FILE_LIMITS.MAX_UPLOAD_SIZE_MB

  const serverPort = env.VITE_SERVER_PORT 
    ? parseInt(env.VITE_SERVER_PORT, 10) 
    : DEFAULTS.SERVER.PORT

  return {
    API_BASE_URL: env.VITE_API_URL || '',
    SERVER_PORT: serverPort,
    OPENCODE_PORT: env.VITE_OPENCODE_PORT 
      ? parseInt(env.VITE_OPENCODE_PORT, 10) 
      : DEFAULTS.OPENCODE.PORT,
    FILE_LIMITS: {
      MAX_SIZE_BYTES: maxFileSizeMB * 1024 * 1024,
      MAX_UPLOAD_SIZE_BYTES: maxUploadSizeMB * 1024 * 1024,
    },
  }
}

export { DEFAULTS, ALLOWED_MIME_TYPES, GIT_PROVIDERS }
