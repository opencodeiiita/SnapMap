import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbType = process.env.DB || "LOCAL";

    const mongoURI =
      dbType === "CLOUD"
        ? process.env.MONGODB_CLOUD_URI
        : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI is missing");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
    console.log("DB Type:", dbType);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

export default connectDB;

