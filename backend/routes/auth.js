import express from "express";
import authMiddleware from "../middleware/authentication.js";
import { registerUser } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login call");
});

router.post("/signup", authMiddleware, registerUser);

export default router;
