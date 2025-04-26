import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SeatDetail = ({ seat, onUnbook }) => {
  if (!seat) return null;

  const getBookingInfo = () => {
    if (seat.fullTimeBooking?.isBooked)
      return { slot: "fullTime", data: seat.fullTimeBooking };
    if (seat.morningBooking?.isBooked)
      return { slot: "morning", data: seat.morningBooking };
    if (seat.eveningBooking?.isBooked)
      return { slot: "evening", data: seat.eveningBooking };
    return null;
  };

  const bookingInfo = getBookingInfo();

  const handleUnbook = async (userId) => {
    try {
      await axios.post(
        `https://rc-library.onrender.com/api/v1/unbook/${seat.seatNumber}/${bookingInfo.slot}/${userId}`
      );
      toast.success("Seat unbooked successfully! ✅");
      onUnbook(); // Refresh seats list
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      toast.error("Failed to unbook the seat ❌");
    }
  };

  const FeePaid = async (userId) => {
    try {
      await axios.post(
        `https://rc-library.onrender.com/api/v1/updateLastFeePaidAt/${userId}`
      );
      toast.success("Fee Paid successfully! ✅");
      onUnbook();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      toast.error("Failed to update fee payment information ❌");
    }
  };

  return (
    <div className="mt-8 p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Seat {seat.seatNumber} Details
      </h2>
      {bookingInfo && bookingInfo.data.users?.length > 0 ? (
        bookingInfo.data.users.map((user, idx) => (
          <div key={idx} className="mb-6 border-b border-gray-700 pb-4">
            <p className="text-gray-300">
              <strong className="text-gray-400">Name: </strong> {user.fullname}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Username: </strong>
              {user.username}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Phone:</strong> {user.phone}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Monthly Fee:</strong> ₹
              {user.monthlyFee}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-400">Joining Date: </strong>
              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>

            <button
              onClick={() => handleUnbook(user._id)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Unbook Seat
            </button>

            <button
              onClick={() => FeePaid(user._id)}
              className="mt-3 ms-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Fee Paid
            </button>


          </div>
        ))
      ) : (
        <p className="text-gray-400">This seat is not booked.</p>
      )}
    </div>
  );
};

export default SeatDetail;
