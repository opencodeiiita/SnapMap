import crypto from "crypto";
import path from "path";
import exifr from "exifr";
import Photo from "../models/Photo.js";
import User from "../models/User.js";
import uploadToAzure from "../utils/azure.js";

const buildFileName = (originalName, clerkUserId) => {
  const ext = path.extname(originalName || "").toLowerCase();
  const safeExt = ext && ext.length <= 10 ? ext : ".jpg";
  const id = crypto.randomUUID();
  return `${clerkUserId}/${Date.now()}-${id}${safeExt}`;
};

const extractExifLocation = async (buffer) => {
  try {
    const exif = await exifr.gps(buffer);
    if (!exif) return null;

    const { latitude, longitude } = exif;

    if (typeof latitude === "number" && typeof longitude === "number") {
      return { latitude, longitude };
    }

    return null;
  } catch (err) {
    console.error("❌ EXIF read error:", err.message);
    return null;
  }
};

// Decide which location to use for a photo:
// 1. Prefer EXIF GPS from the photo
// 2. If no EXIF, fall back to app-provided GPS
// 3. If neither exists, return null so caller can send an error
const resolvePhotoLocation = async (fileBuffer, bodyLat, bodyLon) => {
  const latitude = parseFloat(bodyLat);
  const longitude = parseFloat(bodyLon);

  const hasAppLocation =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  // First, try EXIF GPS from the image
  const exifLocation = await extractExifLocation(fileBuffer);

  if (exifLocation) {
    const { latitude: exifLat, longitude: exifLon } = exifLocation;

    if (hasAppLocation) {
      const sameLat = Math.abs(exifLat - latitude) < 1e-6;
      const sameLon = Math.abs(exifLon - longitude) < 1e-6;

      if (sameLat && sameLon) {
        console.log(
          "📍 EXIF GPS matches app GPS, using photo's EXIF location (preferred)"
        );
      } else {
        console.log(
          "⚠️ EXIF GPS differs from app GPS, using photo's EXIF location (preferred)"
        );
        console.log("  EXIF:", exifLat, exifLon);
        console.log("  APP :", latitude, longitude);
      }
    } else {
      console.log("📍 Using EXIF GPS location from photo");
    }

    return {
      latitude: exifLat,
      longitude: exifLon,
      source: "exif",
    };
  }

  // If no EXIF, fall back to app-provided location (if valid)
  if (hasAppLocation) {
    console.log("📍 No EXIF GPS, using app-provided GPS location");
    return {
      latitude,
      longitude,
      source: "app",
    };
  }

  // Neither EXIF nor app location is available
  return null;
};

export const uploadPhoto = async (req, res) => {
  try {
    console.log("📸 Upload photo endpoint hit");
    console.log("Request body:", req.body);
    console.log(
      "File info:",
      req.file
        ? {
            fieldname: req.file.fieldname,
            size: req.file.size,
            mimetype: req.file.mimetype,
          }
        : "No file"
    );
    console.log("UserId:", req.userId);

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    const { lat, lon } = req.body || {};

    const resolvedLocation = await resolvePhotoLocation(
      req.file.buffer,
      lat,
      lon
    );

    if (!resolvedLocation) {
      return res.status(400).json({
        message:
          "Location is required: no GPS data in photo and no valid app location provided",
      });
    }

    const { latitude, longitude, source } = resolvedLocation;
    console.log(`✅ Using ${source} location:`, latitude, longitude);


    const user = await User.findOne({ clerkUserId: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    console.log("user", user);


    const fileName = buildFileName(req.file.originalname, req.userId);
    const imageUrl = await uploadToAzure(req.file.buffer, fileName);
    console.log("upload successful---URL:", imageUrl);

    const photo = await Photo.create({
      userId: user._id,
      clerkUserId: req.userId,
      imageUrl,
      location: { type: "Point", coordinates: [longitude, latitude] },
      timestamp: new Date(),
      eventId: null,
    });

    console.log("✅ Photo uploaded to MongoDB:", photo._id.toString());
    return res.status(201).json({
      status: "success",
      photoId: photo._id,
      eventId: null,
    });
  } catch (error) {
    console.error("error uploading photo", error);
    return res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const getAllPhotos = async (req, res) => {
  try {
    console.log("📍 Fetching all photos");

    // Fetch all photos from the database
    const photos = await Photo.find({})
      .sort({ timestamp: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects for better performance

    console.log(`✅ Found ${photos.length} photos`);

    // Return photos in the required format
    return res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching all photos:", error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

// Test upload endpoint without authentication (for testing only)
export const testUploadPhoto = async (req, res) => {
  try {
    console.log("🧪 TEST Upload photo endpoint hit");
    console.log("Request body:", req.body);
    console.log("File info:", req.file ? { size: req.file.size, mimetype: req.file.mimetype } : "No file");

    const { lat, lon, testUserId } = req.body || {};
    const clerkUserId = testUserId || "test-user-123"; // Use provided or default test user

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    const resolvedLocation = await resolvePhotoLocation(
      req.file.buffer,
      lat,
      lon
    );

    if (!resolvedLocation) {
      return res.status(400).json({
        message:
          "Location is required: no GPS data in photo and no valid app location provided",
      });
    }

    const { latitude, longitude, source } = resolvedLocation;
    console.log(`✅ [TEST] Using ${source} location:`, latitude, longitude);

    // Find or create test user
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = await User.create({
        clerkUserId,
        name: "Test User",
        email: `${clerkUserId}@test.com`,
        collegeName: "Test College",
      });
      console.log("✅ Created test user:", user._id);
    }

    const fileName = buildFileName(req.file.originalname, clerkUserId);
    const imageUrl = await uploadToAzure(req.file.buffer, fileName);
    console.log("Upload successful - URL:", imageUrl);

    const photo = await Photo.create({
      userId: user._id,
      clerkUserId,
      imageUrl,
      location: { type: "Point", coordinates: [longitude, latitude] },
      timestamp: new Date(),
      eventId: null,
    });

    console.log("✅ TEST Photo uploaded to MongoDB:", photo._id.toString());
    return res.status(201).json({
      status: "success",
      photoId: photo._id,
      imageUrl: imageUrl,
      message: "Test photo uploaded successfully",
    });
  } catch (error) {
    console.error("Error in test upload:", error);
    return res.status(500).json({ 
      message: "Internal server error: " + error.message 
    });
  }
};


// multiple uploads added here//

export const uploadPhotos = async(req,res)=>{
  try{
    if(!req.userId){
      return res.status(401).json({ message: "Unauthorized"});
    }
        if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos provided" });
    }

    const{lat,lon} = req.body || {};

    const user = await User.findOne({ clerkUserId: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const resolvedLocation = await resolvePhotoLocation(
        file.buffer,
        lat,
        lon
      );

      if (!resolvedLocation) {
        return res.status(400).json({
          message:
            "Location is required for all photos: no GPS data in some photos and no valid app location provided",
        });
      }

      const { latitude, longitude, source } = resolvedLocation;
      console.log(
        `✅ [MULTI] Using ${source} location for file ${file.originalname}:`,
        latitude,
        longitude
      );

      const fileName = buildFileName(file.originalname, req.userId);
      const imageUrl = await uploadToAzure(file.buffer, fileName);

      const photo = await Photo.create({
        userId: user._id,
        clerkUserId: req.userId,
        imageUrl,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        timestamp: new Date(),
        eventId: null,
      });

      uploadedPhotos.push({
        photoId: photo._id,
        imageUrl,
      });
    }

        return res.status(201).json({
      status: "success",
      count: uploadedPhotos.length,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error("Upload multiple photos error:", error);
    return res.status(500).json({
      message: "Internal server error: " + error.message,
    });

  }
};
