import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  school: z.string().min(1),
  // url_links may come as a CSV string or array; normalize to array of strings
  url_links: z
    .union([
      z.string().transform((s) =>
        s.trim() === "" ? [] : s.split(",").map((x) => x.trim())
      ),
      z.array(z.string())
    ])
    .optional()
    .transform((v) => v ?? []),
});
