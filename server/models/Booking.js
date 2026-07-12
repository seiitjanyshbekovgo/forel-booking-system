import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    branch: String,
    table: String,
    name: String,
    phone: String,
    date: String,
    time: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
