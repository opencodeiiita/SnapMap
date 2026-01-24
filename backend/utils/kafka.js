import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

let kafkaClient;

const buildKafkaConfig = () => {
  const brokers = (process.env.KAFKA_BROKERS || "")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean);

  if (!brokers.length) {
    throw new Error("KAFKA_BROKERS is required (comma-separated list)");
  }

  const clientId = process.env.KAFKA_CLIENT_ID || "snapmap-backend";
  const config = { clientId, brokers };

  if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
    config.ssl = true;
    config.sasl = {
      mechanism: "plain",
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    };
  }

  return config;
};

function initKafka() {
  if (kafkaClient) return kafkaClient;
  kafkaClient = new Kafka(buildKafkaConfig());
  return kafkaClient;
}

async function createProducer() {
  const kafka = initKafka();
  const producer = kafka.producer();
  await producer.connect();
  return producer;
}

async function createConsumer(groupId) {
  if (!groupId || typeof groupId !== "string") {
    throw new Error("Consumer groupId is required");
  }

  const kafka = initKafka();
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  return consumer;
}

export { initKafka, createProducer, createConsumer };
