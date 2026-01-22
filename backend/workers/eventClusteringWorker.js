import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import { createConsumer, createProducer } from "../utils/kafka.js";
import { PHOTO_UPLOADS } from "../utils/kafkaTopics.js";
import { processPhotoForClustering } from "../services/eventClusteringService.js";
import { CLUSTERING_CONFIG } from "../config/clusteringConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const GROUP_ID =
  process.env.EVENT_CLUSTERING_CONSUMER_GROUP || "snapmap-event-clustering";

const commitNextOffset = async (consumer, topic, partition, offset) => {
  const nextOffset = (Number(offset) + 1).toString();
  await consumer.commitOffsets([{ topic, partition, offset: nextOffset }]);
};

export async function startEventClusteringWorker() {
  await connectDB();

  const consumer = await createConsumer(GROUP_ID);
  const producer = await createProducer();

  await consumer.subscribe({ topic: PHOTO_UPLOADS, fromBeginning: false });

  const shutdown = async () => {
    console.log("[event-clustering] Shutting down worker");
    await Promise.allSettled([consumer.disconnect(), producer.disconnect()]);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log(
    `[event-clustering] Listening on topic ${PHOTO_UPLOADS} with group ${GROUP_ID}`
  );
  console.log(
    `[event-clustering] Config -> distance ${CLUSTERING_CONFIG.distanceThresholdMeters}m, time +/-${CLUSTERING_CONFIG.timeWindowMinutes}m, min photos ${CLUSTERING_CONFIG.minPhotosForEvent}`
  );

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const raw = message.value?.toString() || "";
      const offset = message.offset;
      let payload;

      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.error(
          `[event-clustering] Invalid JSON at offset ${offset}:`,
          err.message || err
        );
        // Skip poisoned messages to avoid blocking the partition
        await commitNextOffset(consumer, topic, partition, offset);
        return;
      }

      try {
        const result = await processPhotoForClustering(payload, producer);
        console.log(
          `[event-clustering] photo ${payload?.photoId || "unknown"} ->`,
          result?.action || "processed"
        );
        await commitNextOffset(consumer, topic, partition, offset);
      } catch (err) {
        console.error(
          `[event-clustering] Failed processing offset ${offset}:`,
          err.message || err
        );
        // Do not commit offset on failure; Kafka will retry
      }
    },
  });
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  startEventClusteringWorker().catch((err) => {
    console.error("[event-clustering] Worker crashed:", err.message || err);
    process.exit(1);
  });
}
