import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "FINALIZED"],
    default: "ACTIVE",
    index: true,
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
    default: 0,
  },
  photoIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
  lastPhotoTimestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  eventTimeStamp: {
    type: Date,
    required : true
  },
});

EventSchema.index({ locationCenter: '2dsphere' });
EventSchema.index({ status: 1, lastPhotoTimestamp: -1 });

const Event = mongoose.model('Event', EventSchema);
export default Event
