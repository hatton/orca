import { z } from 'zod'

/** An agent's own session as its hook reported it: the id it resumes by, and its transcript file. */
export const pluginProviderSessionSchema = z.strictObject({
  id: z.string().min(1).max(1024),
  transcriptPath: z
    .string()
    .min(1)
    .max(32 * 1024)
    .optional()
})
