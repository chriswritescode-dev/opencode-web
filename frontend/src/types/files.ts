export interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
  size: number
  mimeType?: string
  content?: string
  children?: FileInfo[]
  lastModified: Date
}
