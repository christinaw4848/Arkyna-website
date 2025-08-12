import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import applicationsRouter from "./routes/applications";

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(helmet());
app.use(morgan("dev"));

// NOTE: Do NOT use express.json() for file upload routes (multer handles it).
// For non-upload JSON routes, you *can* enable it:
app.use(express.json());

// Mount routes
app.use("/api/applications", applicationsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
