import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import router from "./v1.js";

import { startEventClusteringWorker } from "./workers/eventClusteringWorker.js";
import { startPhotoUpdateWorker } from "./workers/photoUpdateWorker.js";
import { startEventSweeper } from "./jobs/eventSweeper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const APP_ROLE = process.env.APP_ROLE || "api";
const PORT = process.env.PORT || 5000;

//API SERVER STARTUP

async function startApiServer() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());

  app.use("/api/v1", router);

  app.get("/", (req, res) => {
    res.send("Welcome to SnapMap API");
  });

  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[api] Server running on port ${PORT}`);
  });
}

//ROLE BASED BOOTSTRAP

async function bootstrap() {
  console.log(`[bootstrap] Starting backend with role: ${APP_ROLE}`);

  switch (APP_ROLE) {
    case "api":
      await startApiServer();
      break;

    case "event-clustering-worker":
      await startEventClusteringWorker();
      break;

    case "photo-update-worker":
      await startPhotoUpdateWorker();
      break;

    case "sweeper":
      await startEventSweeper();
      break;

    default:
      console.error(`[bootstrap] Invalid APP_ROLE: ${APP_ROLE}`);
      process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error("[bootstrap] Fatal startup error:", err);
  process.exit(1);
});
