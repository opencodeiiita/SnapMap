import cron from "node-cron";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import {
  findUnassignedPhotos,
  requeuePhotosForClustering,
  finalizeInactiveEvents,
} from "../services/eventSweeperService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const CRON_EXPR = process.env.EVENT_SWEEPER_CRON || "*/5 * * * *"; // every 5 mins

export async function runEventSweeper() {
  console.log("[event-sweeper] Sweep started");

  try {
    const unassignedPhotos = await findUnassignedPhotos();

    if (unassignedPhotos.length > 0) {
      console.log(
        `[event-sweeper] Found ${unassignedPhotos.length} unassigned photos`
      );
      await requeuePhotosForClustering(unassignedPhotos);
    } else {
      console.log("[event-sweeper] No unassigned photos found");
    }

    const finalizedCount = await finalizeInactiveEvents();

    if (finalizedCount > 0) {
      console.log(
        `[event-sweeper] Finalized ${finalizedCount} inactive events`
      );
    }
  } catch (err) {
    console.error("[event-sweeper] Sweep failed:", err.message || err);
  }

  console.log("[event-sweeper] Sweep completed");
}

export async function startEventSweeper() {
  await connectDB();

  console.log(`[event-sweeper] Scheduling job: ${CRON_EXPR}`);

  cron.schedule(CRON_EXPR, async () => {
    await runEventSweeper();
  });
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  startEventSweeper().catch((err) => {
    console.error("[event-sweeper] Worker crashed:", err.message || err);
    process.exit(1);
  });
}
