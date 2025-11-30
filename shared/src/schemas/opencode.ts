import { z } from 'zod'

export const FileDiffSchema = z.object({
  file: z.string(),
  before: z.string(),
  after: z.string(),
  additions: z.number(),
  deletions: z.number(),
})

export const SessionSchema = z.object({
  id: z.string(),
  projectID: z.string(),
  directory: z.string(),
  parentID: z.string().optional(),
  summary: z.object({
    diffs: FileDiffSchema.array(),
  }).optional(),
  share: z.object({
    url: z.string(),
  }).optional(),
  title: z.string(),
  version: z.string(),
  time: z.object({
    created: z.number(),
    updated: z.number(),
    compacting: z.number().optional(),
  }),
  revert: z.object({
    messageID: z.string(),
    partID: z.string().optional(),
    snapshot: z.string().optional(),
    diff: z.string().optional(),
  }).optional(),
})

export const MessageSchema = z.object({
  id: z.string(),
  sessionID: z.string(),
  role: z.enum(['user', 'assistant']),
  time: z.object({
    created: z.number(),
    completed: z.number().optional(),
  }),
})

export type FileDiff = z.infer<typeof FileDiffSchema>