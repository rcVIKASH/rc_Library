import { Router } from "express";
import { wrapAsync } from "../utils/warpAsync.js";
import {
  bookSeat,
  getAllSeats,
  unbookSeat,
  updateLastFeePaidAt,
} from "../controllers/user.controller.js";
import { validateBookingInput } from "../middlewares/validateBookingInput.js";

const router = Router();

router.route("/bookSeat").post(validateBookingInput, wrapAsync(bookSeat));
router
  .route("/unbook/:seatNumber/:bookingSlot/:userId")
  .post(wrapAsync(unbookSeat));
router.route("/seats").get(wrapAsync(getAllSeats));
router.route("/updateLastFeePaidAt/:userId").post(wrapAsync(updateLastFeePaidAt));

export default router;
