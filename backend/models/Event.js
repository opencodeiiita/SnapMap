import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  locationCenter: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 2;
        },
        message: "Coordinates must be in [longitude, latitude] format",
      },
    },
  },

  radius: {
    type: Number,
    required: true,
  },

  photoCount: {
    type: Number,
    default: 0,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

EventSchema.index({ locationCenter: "2dsphere" });

const Event = mongoose.model("Event", EventSchema);
export default Event;
