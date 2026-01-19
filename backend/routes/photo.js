import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authentication.js";
import { uploadPhoto, uploadPhotos, getAllPhotos, testUploadPhoto } from "../controllers/photoController.js";


const router = express.Router();
router.get("/ping", (req, res) => {
  res.json({ pong: true });
});


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    return cb(null, true);
  },
});

router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("photo"),
  uploadPhoto
);

router.post(
  "/upload-photos",
  authMiddleware,
  upload.array("photos[]", 10),
  uploadPhotos
);

router.post(
  "/test-upload",
  upload.single("photo"),
  testUploadPhoto
);

router.get("/all-photos", getAllPhotos);




export default router
