import dotenv from "dotenv";
dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

// Tunable clustering knobs (env overrides available)
export const DISTANCE_THRESHOLD_METERS = toNumber(
  process.env.EVENT_DISTANCE_THRESHOLD_METERS,
  75
);

export const TIME_WINDOW_MINUTES = toNumber(
  process.env.EVENT_TIME_WINDOW_MINUTES,
  15
);

export const MIN_PHOTOS_FOR_EVENT = toNumber(
  process.env.MIN_PHOTOS_FOR_EVENT,
  5
);

export const TIME_WINDOW_MS = TIME_WINDOW_MINUTES * 60 * 1000;

export const CLUSTERING_CONFIG = {
  distanceThresholdMeters: DISTANCE_THRESHOLD_METERS,
  timeWindowMinutes: TIME_WINDOW_MINUTES,
  minPhotosForEvent: MIN_PHOTOS_FOR_EVENT,
};
