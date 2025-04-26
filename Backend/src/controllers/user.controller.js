// user.controller.js
import Seat from "../models/seat.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { ExpressError } from "../utils/ExpressError.js";

export const bookSeat = async (req, res) => {
  const { fullname, username, phone, seatNumber, bookingSlot, monthlyFee } =
    req.body;

  try {
    // Check if the seat already exists
    let seat = await Seat.findOne({ seatNumber });

    // If the seat doesn't exist, create a new one
    if (!seat) {
      seat = await Seat.create({
        seatNumber,
      });
    }

    if (!seat) {
      // Double check in case create fails
      throw new ExpressError(500, "Failed to create seat.");
    }

    let bookingInfo;

    if (bookingSlot === "fullTime") {
      if (
        seat.fullTimeBooking.isBooked ||
        seat.morningBooking.isBooked ||
        seat.eveningBooking.isBooked
      ) {
        throw new ExpressError(
          400,
          "Seat is already partially or fully booked!"
        );
      }
      bookingInfo = seat.fullTimeBooking;
    } else if (bookingSlot === "morning") {
      if (seat.fullTimeBooking.isBooked) {
        throw new ExpressError(
          400,
          "Seat is fully booked and can't be booked for morning!"
        );
      }
      if (seat.morningBooking.isBooked) {
        throw new ExpressError(400, "Seat is already booked for the morning!");
      }
      bookingInfo = seat.morningBooking;
    } else if (bookingSlot === "evening") {
      if (seat.fullTimeBooking.isBooked) {
        throw new ExpressError(
          400,
          "Seat is fully booked and can't be booked for evening!"
        );
      }
      if (seat.eveningBooking.isBooked) {
        throw new ExpressError(400, "Seat is already booked for the evening!");
      }
      bookingInfo = seat.eveningBooking;
    } else {
      throw new ExpressError(400, "Invalid booking slot!");
    }

    const user = await User.create({
      fullname,
      username,
      phone,
      monthlyFee,
    });

    if (!user) {
      // Double check in case create fails
      throw new ExpressError(500, "Failed to create user.");
    }

    bookingInfo.isBooked = true;
    bookingInfo.users.push(user._id);

    await seat.save();

    return res
      .status(200)
      .json(new ApiResponse(200, { seat, user }, "Seat booked successfully!"));
  } catch (error) {
    console.error("Booking error:", error); // Log the error
    if (error instanceof ExpressError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const unbookSeat = async (req, res) => {
  const { userId, seatNumber, bookingSlot } = req.params;

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      throw new ExpressError(404, "Seat not found");
    }

    let bookingInfo;

    if (bookingSlot === "fullTime") {
      bookingInfo = seat.fullTimeBooking;
    } else if (bookingSlot === "morning") {
      bookingInfo = seat.morningBooking;
    } else if (bookingSlot === "evening") {
      bookingInfo = seat.eveningBooking;
    } else {
      throw new ExpressError(400, "Invalid booking slot!");
    }

    // Check if the seat is already unbooked
    if (!bookingInfo.isBooked) {
      throw new ExpressError(
        400,
        "Seat is not currently booked for this slot."
      );
    }

    // Remove the user from the booking slot
    bookingInfo.users = bookingInfo.users.filter(
      (id) => id.toString() !== userId
    );

    // If there are no more users, mark the slot as available
    if (bookingInfo.users.length === 0) {
      bookingInfo.isBooked = false;
    }

    await seat.save();

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, { seat }, "Seat unbooked successfully!"));
  } catch (error) {
    console.error("Unbooking error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const updateLastFeePaidAt = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { lastFeePaidAt: Date.now() },
      { new: true }
    );

    if (!updatedUser) {
      throw new ExpressError(404, "User not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedUser },
          "Last fee paid time updated successfully"
        )
      );
  } catch (error) {
    console.error(error);
    throw new ExpressError(500, "Internal server error, time failed to update");
  }
};

export const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find({})
      .sort({ seatNumber: 1 })
      .populate("fullTimeBooking.users")
      .populate("morningBooking.users")
      .populate("eveningBooking.users");

    return res.status(200).json(new ApiResponse(200, seats, "Seats fetched"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "Server error"));
  }
};
