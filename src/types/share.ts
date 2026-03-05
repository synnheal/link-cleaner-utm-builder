import { z } from "zod";

export const shareStateSchema = z.object({
  v: z.literal(1),
  tool: z.enum(["cleaner", "utm", "encoder"]),
  inputUrl: z.string(),
  cleanOptions: z
    .object({
      removeUtm: z.boolean(),
      removeAdIds: z.boolean(),
      sortParams: z.boolean(),
      removeFragments: z.boolean(),
      decodeBeforeClean: z.boolean(),
    })
    .optional(),
  utmParams: z
    .object({
      source: z.string(),
      medium: z.string(),
      campaign: z.string(),
      term: z.string(),
      content: z.string(),
    })
    .optional(),
  utmOptions: z
    .object({
      replaceExisting: z.boolean(),
    })
    .optional(),
  codecOptions: z
    .object({
      mode: z.enum(["url", "base64"]),
      direction: z.enum(["encode", "decode"]),
    })
    .optional(),
});

export type ShareState = z.infer<typeof shareStateSchema>;
