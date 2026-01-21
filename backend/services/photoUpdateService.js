import Photo from "../models/Photo.js";

/**
 * Check if photo already has an eventId assigned
 * @param {string} photoId
 * @returns {boolean}
 */
export async function isPhotoAlreadyAssigned(photoId) {
  const photo = await Photo.findById(photoId).select("eventId").lean();
  return Boolean(photo?.eventId);
}

/**
 * Assign eventId to photos safely (idempotent)
 * @param {string[]} photoIds
 * @param {string} eventId
 */
export async function assignEventToPhotos(photoIds, eventId) {
  if (!Array.isArray(photoIds) || !eventId) {
    throw new Error("photoIds array and eventId are required");
  }

  for (const photoId of photoIds) {
    const alreadyAssigned = await isPhotoAlreadyAssigned(photoId);

    if (alreadyAssigned) {
      continue; // idempotent: skip already processed photo
    }

    await Photo.updateOne(
      { _id: photoId, eventId: { $exists: false } },
      { $set: { eventId } }
    );
  }
}
