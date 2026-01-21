import Event from "../models/Event.js";
import Photo from "../models/Photo.js";
import { EVENT_UPDATES } from "../utils/kafkaTopics.js";
import {
  DISTANCE_THRESHOLD_METERS,
  TIME_WINDOW_MS,
  TIME_WINDOW_MINUTES,
  MIN_PHOTOS_FOR_EVENT,
} from "../config/clusteringConfig.js";

const EARTH_RADIUS_M = 6371000;
const LOCATION_BUCKET_PRECISION = 4;

const toDate = (value) => (value instanceof Date ? value : new Date(value));

const haversineDistanceMeters = (fromCoordinates, toCoordinates) => {
  if (
    !Array.isArray(fromCoordinates) ||
    !Array.isArray(toCoordinates) ||
    fromCoordinates.length < 2 ||
    toCoordinates.length < 2
  ) {
    return Infinity;
  }

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const [lon1, lat1] = fromCoordinates;
  const [lon2, lat2] = toCoordinates;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
};

const computeCentroid = (points) => {
  if (!points.length) return null;
  const { sumLon, sumLat } = points.reduce(
    (acc, [lon, lat]) => ({
      sumLon: acc.sumLon + lon,
      sumLat: acc.sumLat + lat,
    }),
    { sumLon: 0, sumLat: 0 }
  );
  return [sumLon / points.length, sumLat / points.length];
};

const computeMedianTimestamp = (timestamps) => {
  if (!timestamps.length) return null;
  const sorted = [...timestamps].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return new Date(sorted[mid]);
  }
  return new Date((sorted[mid - 1] + sorted[mid]) / 2);
};

const timeBounds = (timestamp) => {
  const ts = toDate(timestamp).getTime();
  return {
    $gte: new Date(ts - TIME_WINDOW_MS),
    $lte: new Date(ts + TIME_WINDOW_MS),
  };
};

const pendingBuckets = new Map();

const makeBucketKey = (coordinates, timestamp) => {
  const [lon, lat] = coordinates;
  const roundedLat = lat.toFixed(LOCATION_BUCKET_PRECISION);
  const roundedLon = lon.toFixed(LOCATION_BUCKET_PRECISION);
  const timeBucket = Math.floor(toDate(timestamp).getTime() / TIME_WINDOW_MS);
  return `${roundedLat}:${roundedLon}:${timeBucket}`;
};

const collectPendingCluster = (photo) => {
  if (!photo?.location?.coordinates?.length || !photo.timestamp) return null;
  const key = makeBucketKey(photo.location.coordinates, photo.timestamp);
  const bucket = pendingBuckets.get(key) || [];

  const withinWindow = bucket.filter((p) => {
    const ts = toDate(p.timestamp).getTime();
    const current = toDate(photo.timestamp).getTime();
    return Math.abs(ts - current) <= TIME_WINDOW_MS;
  });

  const already = withinWindow.some(
    (p) => p._id.toString() === photo._id.toString()
  );
  const updated = already ? withinWindow : [...withinWindow, photo];

  if (updated.length >= MIN_PHOTOS_FOR_EVENT) {
    pendingBuckets.delete(key);
    return updated;
  }

  pendingBuckets.set(key, updated);
  return null;
};

export async function findNearbyActiveEvents(location, timestamp) {
  if (!location?.coordinates?.length) return [];
  const [lon, lat] = location.coordinates;

  const candidates = await Event.find({
    status: "ACTIVE",
    lastPhotoTimestamp: timeBounds(timestamp),
    locationCenter: {
      $near: {
        $geometry: { type: "Point", coordinates: [lon, lat] },
        $maxDistance: DISTANCE_THRESHOLD_METERS,
      },
    },
  }).lean();

  return candidates.map((event) => ({
    ...event,
    _distance: haversineDistanceMeters(
      location.coordinates,
      event?.locationCenter?.coordinates
    ),
  }));
}

export async function createNewEvent(candidatePhotos) {
  if (!Array.isArray(candidatePhotos) || candidatePhotos.length < MIN_PHOTOS_FOR_EVENT) {
    return null;
  }

  const photoIds = candidatePhotos.map((p) => p._id);
  const coordinates = candidatePhotos.map((p) => p.location.coordinates);
  const timestamps = candidatePhotos.map((p) => toDate(p.timestamp).getTime());

  const centroid = computeCentroid(coordinates);
  const medianTimestamp = computeMedianTimestamp(timestamps);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  const eventDoc = await Event.create({
    name: "SnapMap Event",
    status: "ACTIVE",
    locationCenter: { type: "Point", coordinates: centroid },
    radius: DISTANCE_THRESHOLD_METERS,
    photoCount: photoIds.length,
    photoIds,
    startTime: new Date(minTimestamp),
    endTime: new Date(maxTimestamp),
    lastPhotoTimestamp: new Date(maxTimestamp),
    eventTimeStamp: medianTimestamp || new Date(),
  });

  return {
    eventId: eventDoc._id,
    photoIds: photoIds.map((id) => id.toString()),
    event: eventDoc,
    action: "created",
  };
}

export async function updateExistingEvent(event, photo) {
  if (!event) return null;

  const existing = await Event.findById(event._id);
  if (!existing || existing.status !== "ACTIVE") {
    return null;
  }

  const alreadyLinked = existing.photoIds?.some(
    (id) => id.toString() === photo._id.toString()
  );
  if (alreadyLinked) {
    return { eventId: existing._id, photoIds: [], action: "already-linked" };
  }

  const currentCount = existing.photoCount || existing.photoIds?.length || 0;
  const [currLon, currLat] = existing.locationCenter?.coordinates || [
    photo.location.coordinates[0],
    photo.location.coordinates[1],
  ];
  const [newLon, newLat] = photo.location.coordinates;
  const newCount = currentCount + 1;

  const updatedCenter = {
    type: "Point",
    coordinates: [
      (currLon * currentCount + newLon) / newCount,
      (currLat * currentCount + newLat) / newCount,
    ],
  };

  const lastPhotoTimestamp = toDate(
    Math.max(
      toDate(existing.lastPhotoTimestamp || existing.eventTimeStamp).getTime(),
      toDate(photo.timestamp).getTime()
    )
  );

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: existing._id, status: "ACTIVE", photoIds: { $ne: photo._id } },
    {
      $set: {
        locationCenter: updatedCenter,
        radius: DISTANCE_THRESHOLD_METERS,
        endTime: lastPhotoTimestamp,
        lastPhotoTimestamp,
      },
      $inc: { photoCount: 1 },
      $push: { photoIds: photo._id },
    },
    { new: true }
  );

  if (!updatedEvent) {
    return { eventId: existing._id, photoIds: [], action: "already-linked" };
  }

  return {
    eventId: updatedEvent._id,
    photoIds: [photo._id.toString()],
    event: updatedEvent,
    action: "updated",
  };
}

export async function emitEventUpdate(eventId, photoIds, producer) {
  if (!photoIds?.length) return null;
  if (!producer) {
    throw new Error("Kafka producer instance is required");
  }

  const payload = {
    eventId: eventId.toString(),
    photoIds: photoIds.map((id) => id.toString()),
  };

  await producer.send({
    topic: EVENT_UPDATES,
    messages: [
      {
        key: payload.eventId,
        value: JSON.stringify(payload),
      },
    ],
  });

  return payload;
}

export async function processPhotoForClustering(photoEvent, producer) {
  const photoId = photoEvent?.photoId || photoEvent?._id || photoEvent?.id;
  if (!photoId) {
    throw new Error("photoId missing in event payload");
  }

  const photo = await Photo.findById(photoId).lean();
  if (!photo) {
    throw new Error(`Photo ${photoId} not found`);
  }

  if (!photo.location?.coordinates?.length || !photo.timestamp) {
    throw new Error(`Photo ${photoId} missing location or timestamp for clustering`);
  }

  if (photo.eventId) {
    return { action: "already-assigned", eventId: photo.eventId, photoIds: [] };
  }

  const nearbyEvents = await findNearbyActiveEvents(
    photo.location,
    photo.timestamp
  );

  const sorted = nearbyEvents.sort((a, b) => {
    if (a._distance !== b._distance) return a._distance - b._distance;
    return (
      toDate(b.lastPhotoTimestamp).getTime() -
      toDate(a.lastPhotoTimestamp).getTime()
    );
  });

  const bestMatch = sorted[0];

  if (bestMatch) {
    const updateResult = await updateExistingEvent(bestMatch, photo);
    if (updateResult?.photoIds?.length) {
      await emitEventUpdate(updateResult.eventId, updateResult.photoIds, producer);
    }
    return updateResult || { action: "no-update" };
  }

  const candidatePhotos = collectPendingCluster(photo);
  const creationResult =
    candidatePhotos && candidatePhotos.length >= MIN_PHOTOS_FOR_EVENT
      ? await createNewEvent(candidatePhotos)
      : null;
  if (creationResult?.photoIds?.length) {
    await emitEventUpdate(
      creationResult.eventId,
      creationResult.photoIds,
      producer
    );
  }
  return (
    creationResult || {
      action: "pending-cluster",
      reason: `Need at least ${MIN_PHOTOS_FOR_EVENT} photos within ${DISTANCE_THRESHOLD_METERS}m and ${TIME_WINDOW_MINUTES}m`,
    }
  );
}
