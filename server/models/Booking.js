import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    branch: {
      type: String,
      required: true,
    },

    table: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    // Предоплата
    prepaymentAmount: {
      type: Number,
      required: true,
      min: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Booking", bookingSchema);