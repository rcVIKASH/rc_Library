// user.model.js
import mongoose from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensure username is unique
    },
    phone: {
      type: String,
      required: true,
    },
    lastFeePaidAt: {
      type: Date,
      default: Date.now(),
    },
    monthlyFee: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
