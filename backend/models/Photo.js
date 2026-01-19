import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clerkUserId: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  }
});

PhotoSchema.index({ location: '2dsphere' });

const Photo = mongoose.model('Photo', PhotoSchema);
export default Photo
