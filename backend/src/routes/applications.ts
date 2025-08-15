import { Router } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { applicationSchema } from "../validators";


const prisma = new PrismaClient();
const router = Router();

// In-memory storage so we can save into Postgres (BYTEA/Bytes)
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/applications
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const parsed = applicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid form data", details: parsed.error.flatten() });
    }
    const { name, age, email, school, url_links } = parsed.data;

    const file = req.file;
    const created = await prisma.application.create({
      data: {
        name,
        age: age ?? null,
        email,
        school,
        urlLinks: url_links,
        resumeBytes: file ? file.buffer : null,
        resumeFilename: file?.originalname ?? null,
        resumeMimetype: file?.mimetype ?? null,
      },
      select: { id: true },
    });

    res.status(201).json({ id: created.id, message: "Application submitted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// (Optional) GET list for admin use
router.get("/", async (_req, res) => {
  const rows = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, school: true, createdAt: true, urlLinks: true,
      resumeFilename: true, resumeMimetype: true
    },
  });
  res.json(rows);
});

// GET /api/applications/:id/resume (download the stored file)
// In browser, go to following link (replace 123 with the id of the application): http://localhost:4000/api/applications/123/resume

router.get("/:id/resume", async (req, res) => {
  const id = Number(req.params.id);
  const row = await prisma.application.findUnique({ where: { id } });
  if (!row || !row.resumeBytes) return res.status(404).send("Not found");

  res.setHeader("Content-Type", row.resumeMimetype || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${row.resumeFilename || "resume"}"`);
  res.send(Buffer.from(row.resumeBytes));
});

export default router;
