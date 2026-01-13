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

    if (
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      return { latitude, longitude };
    }

    return null;
  } catch (err) {
    console.error("❌ EXIF read error:", err.message);
    return null;
  }
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

    const { lat, lon } = req.body || {};
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: "Invalid or missing lat/lon" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Photo file is required" });
    }

    const exifLocation = await extractExifLocation(req.file.buffer);

    if (exifLocation) {
      console.log("📍 EXIF GPS FOUND:");
      console.log("Latitude:", exifLocation.latitude);
      console.log("Longitude:", exifLocation.longitude);
    } else {
      console.log("📭 No GPS data found in EXIF");
    }


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
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const clerkUserId = testUserId || "test-user-123"; // Use provided or default test user

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: "Invalid or missing lat/lon" });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Photo file is required" });
    }

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
    const{lat,lon} = req.body || {};
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if(!req.userId){
      return res.status(401).json({ message: "Unauthorized"});
    }
        if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos provided" });
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: "Invalid or missing lat/lon" });
    }
       const user = await User.findOne({ clerkUserId: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
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
