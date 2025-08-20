const { z } = require("zod");

const applicationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  school: z.string().min(1),
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

module.exports = { applicationSchema };
