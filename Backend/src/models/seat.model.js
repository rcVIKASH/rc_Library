// seat.model.js
import mongoose from "mongoose";

// Define the Seat Schema
const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
      unique: true, // Ensure no duplicate seat numbers
    },
    fullTimeBooking: {
      isBooked: { type: Boolean, default: false },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    morningBooking: {
      isBooked: { type: Boolean, default: false },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    eveningBooking: {
      isBooked: { type: Boolean, default: false },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
