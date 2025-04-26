import { ApiResponse } from "../utils/Apiresponse.js";

export const validateBookingInput = (req, res, next) => {
  const { fullname, username, phone, seatNumber, bookingSlot, monthlyFee } =
    req.body;

  if (
    !fullname ||
    !username ||
    !phone ||
    !seatNumber ||
    !bookingSlot ||
    !monthlyFee
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Missing required booking fields"));
  }

  if (!["morning", "evening", "fullTime"].includes(bookingSlot)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid bookingSlot"));
  }

  next();
};
