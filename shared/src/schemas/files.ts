import { z } from 'zod'

export const FileInfoSchema: z.ZodType<{
  name: string
  path: string
  isDirectory: boolean
  size: number
  mimeType?: string
  content?: string
  children?: Array<any>
  lastModified: Date
}> = z.object({
  name: z.string(),
  path: z.string(),
  isDirectory: z.boolean(),
  size: z.number(),
  mimeType: z.string().optional(),
  content: z.string().optional(),
  children: z.lazy(() => z.array(FileInfoSchema)).optional(),
  lastModified: z.date(),
})

export const CreateFileRequestSchema = z.object({
  type: z.enum(['file', 'folder']),
  content: z.string().optional(),
})

export const RenameFileRequestSchema = z.object({
  newPath: z.string(),
})

export const FileUploadResponseSchema = z.object({
  name: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
})
