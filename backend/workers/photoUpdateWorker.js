import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import { createConsumer } from "../utils/kafka.js";
import { EVENT_UPDATES } from "../utils/kafkaTopics.js";
import { assignEventToPhotos } from "../services/photoUpdateService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const GROUP_ID =
  process.env.PHOTO_UPDATE_CONSUMER_GROUP || "snapmap-photo-update-worker";

const commitNextOffset = async (consumer, topic, partition, offset) => {
  const nextOffset = (Number(offset) + 1).toString();
  await consumer.commitOffsets([{ topic, partition, offset: nextOffset }]);
};

export async function startPhotoUpdateWorker() {
  await connectDB();

  const consumer = await createConsumer(GROUP_ID);

  await consumer.subscribe({
    topic: EVENT_UPDATES,
    fromBeginning: false,
  });

  const shutdown = async () => {
    console.log("[photo-update] Shutting down worker");
    await consumer.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log(
    `[photo-update] Listening on topic ${EVENT_UPDATES} with group ${GROUP_ID}`
  );

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const raw = message.value?.toString() || "";
      const offset = message.offset;

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (err) {
        console.error(
          `[photo-update] Invalid JSON at offset ${offset}`,
          err.message || err
        );
        await commitNextOffset(consumer, topic, partition, offset);
        return;
      }

      const { eventId, photoIds } = payload || {};

      if (!eventId || !Array.isArray(photoIds)) {
        console.error(
          `[photo-update] Invalid payload at offset ${offset}`,
          payload
        );
        await commitNextOffset(consumer, topic, partition, offset);
        return;
      }

      try {
        await assignEventToPhotos(photoIds, eventId);
        console.log(
          `[photo-update] Assigned event ${eventId} to ${photoIds.length} photos`
        );
        await commitNextOffset(consumer, topic, partition, offset);
      } catch (err) {
        console.error(
          `[photo-update] Failed processing offset ${offset}`,
          err.message || err
        );
      }
    },
  });
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  startPhotoUpdateWorker().catch((err) => {
    console.error("[photo-update] Worker crashed:", err.message || err);
    process.exit(1);
  });
}
