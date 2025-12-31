import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  collegeName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,

  },
  year: {
    type: String,

  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],

  },
  role: {
    type: String,
    default: "USER",

  },
  isBanned: {
    type: Boolean,
    default: false,

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
