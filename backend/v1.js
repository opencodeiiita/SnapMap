import express from "express";

const router = express.Router();
import healthRoute from "./routes/health.js";
import authRoute from "./routes/auth.js";
router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.get("/", (req, res) => {
    res.send("SnapMap API v1");
});

export default router;