import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { runSeoAnalysis } from "./analyzer";

const app = express();
const port = Number(process.env.BACKEND_PORT) || 5051;

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

const analyzeSchema = z.object({
  url: z.string().url({ message: "A valid URL is required." }),
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post("/api/analyze", async (req, res) => {
  const parseResult = analyzeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "invalid_request",
      details: parseResult.error.flatten(),
    });
  }

  try {
    const report = await runSeoAnalysis(parseResult.data.url);
    return res.json(report);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Analysis error", error);
    return res.status(500).json({
      error: "analysis_failed",
      message:
        error instanceof Error ? error.message : "Failed to analyze the provided URL.",
    });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "not_found" });
});

const distDir = path.resolve(__dirname, "../../web/dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SEO Analyzer API listening on http://localhost:${port}`);
});
