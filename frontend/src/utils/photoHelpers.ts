export type UserUpload = {
  id: string;
  uri: string;
  caption?: string;
  timestamp?: string | number | Date;
  location?: string;
  badge?: "ended" | "live" | "featured" | null;
};

// Convert assorted photo payloads (strings, arrays, or objects) into a flat list
export const normalizeUserUploads = (rawPhotos: any[] = []): UserUpload[] => {
  const uploads: UserUpload[] = [];

  rawPhotos.forEach((item, index) => {
    // Simple string URL
    if (typeof item === "string") {
      uploads.push({ id: `photo-${index}`, uri: item });
      return;
    }

    // Array of URLs
    if (Array.isArray(item)) {
      item.forEach((uri, innerIndex) => {
        uploads.push({ id: `photo-${index}-${innerIndex}`, uri });
      });
      return;
    }

    // Object with metadata
    if (item && typeof item === "object") {
      const urls = Array.isArray(item.imageUrl)
        ? item.imageUrl
        : item.imageUrl
        ? [item.imageUrl]
        : [];

      urls.forEach((uri: string, innerIndex: number) => {
        uploads.push({
          id: item._id ? `${item._id}-${innerIndex}` : `photo-${index}-${innerIndex}`,
          uri,
          caption: item.caption || "",
          timestamp: item.timestamp || item.createdAt,
          location: item.locationName || item.locationLabel || item.location,
          badge: item.badge ?? null,
        });
      });
    }
  });

  return uploads;
};

export const formatTimestamp = (value?: string | number | Date) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const datePart = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const timePart = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${datePart} • ${timePart}`;
};
