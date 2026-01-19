import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  locationCenter: {
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
  radius: {
    type: Number,
    required: true,
  },
  photoCount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

EventSchema.index({ locationCenter: '2dsphere' });

const Event = mongoose.model('Event', EventSchema);
export default Event
