import { z } from "zod";

export const AuthEntrySchema = z.object({
  type: z.enum(["apiKey", "oauth"]),
  apiKey: z.string().optional(),
  refresh: z.string().optional(),
  access: z.string().optional(),
  expires: z.number().optional(),
});

export const AuthCredentialsSchema = z.record(z.string(), AuthEntrySchema);

export const SetCredentialRequestSchema = z.object({
  apiKey: z.string().min(1),
});

export const CredentialStatusResponseSchema = z.object({
  hasCredentials: z.boolean(),
});

export const CredentialListResponseSchema = z.object({
  providers: z.array(z.string()),
});
