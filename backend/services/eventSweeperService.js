import Photo from "../models/Photo.js";
import Event from "../models/Event.js";
import { createProducer } from "../utils/kafka.js";
import { PHOTO_UPLOADS } from "../utils/kafkaTopics.js";

const DEFAULT_LOOKBACK_MINUTES = Number(
  process.env.EVENT_SWEEPER_LOOKBACK_MINUTES || 60
);

const MAX_BATCH_SIZE = Number(
  process.env.EVENT_SWEEPER_BATCH_SIZE || 200
);

const EVENT_INACTIVITY_MINUTES = Number(
  process.env.EVENT_FINALIZE_INACTIVE_MINUTES || 60
);

export async function findUnassignedPhotos() {
  const cutoff = new Date(
    Date.now() - DEFAULT_LOOKBACK_MINUTES * 60 * 1000
  );

  return Photo.find({
    $or: [{ eventId: { $exists: false } }, { eventId: null }],
    createdAt: { $gte: cutoff },
  })
    .sort({ createdAt: 1 })
    .limit(MAX_BATCH_SIZE)
    .select("_id location timestamp")
    .lean();
}

export async function requeuePhotosForClustering(photos) {
  if (!Array.isArray(photos) || photos.length === 0) return;

  const producer = await createProducer();

  try {
    const messages = photos.map((photo) => ({
      key: photo._id.toString(),
      value: JSON.stringify({
        photoId: photo._id.toString(),
        timestamp: photo.timestamp,
        location: photo.location,
        reason: "event-sweeper-retry",
      }),
    }));

    await producer.send({
      topic: PHOTO_UPLOADS,
      messages,
    });

    console.log(
      `[event-sweeper] Requeued ${messages.length} photos for clustering`
    );
  } finally {
    await producer.disconnect();
  }
}

export async function finalizeInactiveEvents() {
  const cutoff = new Date(
    Date.now() - EVENT_INACTIVITY_MINUTES * 60 * 1000
  );

  const result = await Event.updateMany(
    {
      status: "ACTIVE",
      lastPhotoTimestamp: { $lt: cutoff },
    },
    {
      $set: { status: "FINALIZED" },
    }
  );

  return result.modifiedCount || 0;
}
