import { createConsumer, createProducer } from "../utils/kafka.js";
import { PHOTO_UPLOADS } from "../utils/kafkaTopics.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const topic = PHOTO_UPLOADS;
const testValue = `kafka-selftest-${Date.now()}`;
const groupId = `snapmap-selftest-${Math.random().toString(16).slice(2, 8)}`;

const timeoutMs = 15000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const consumer = await createConsumer(groupId);
  await consumer.subscribe({ topic, fromBeginning: false });

  let messageSeen = false;
  const messagePromise = new Promise((resolve, reject) => {
    consumer
      .run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          console.log("Consumed message:", value);
          if (value === testValue) {
            messageSeen = true;
            resolve();
          }
        },
      })
      .catch(reject);
  });

  // Give the consumer a moment to join before producing
  await wait(750);

  const producer = await createProducer();
  await producer.send({
    topic,
    messages: [{ value: testValue }],
  });
  await producer.disconnect();

  const timeoutPromise = wait(timeoutMs).then(() => {
    throw new Error("Timed out waiting for Kafka message");
  });

  try {
    await Promise.race([messagePromise, timeoutPromise]);
    console.log("Kafka connectivity OK");
  } finally {
    await consumer.disconnect();
    if (!messageSeen) {
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error("Kafka self-test failed:", err.message || err);
  process.exit(1);
});
