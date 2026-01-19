import express from "express"
import multer from "multer";
import authMiddleware from "../middleware/authentication.js";
import { registerUser, profileUpdate } from "../controllers/authController.js"

const router = express.Router();

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

router.post("/login", (req, res) => {
  res.send("Login call");
});

router.post("/signup", authMiddleware, registerUser);

router.post("/profile-update", authMiddleware, upload.single("profileImg"), profileUpdate);

export default router
