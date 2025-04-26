import React, { useEffect, useState } from "react";
import SeatCard from "../components/SeatCard";
import SeatDetail from "../components/SeatDetail";
import BookingForm from "../components/BookingForm";
import axios from "axios";

const LandingPage = () => {
  const [seats, setSeats] = useState([]);
  const [expandedSeats, setExpandedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const fetchSeats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/seats");
      const seatData = res.data?.data || [];
      setSeats(seatData);

      const tempExpanded = [];
      seatData.forEach((seat) => {
        if (seat.fullTimeBooking?.isBooked) {
          tempExpanded.push({ ...seat, timeSlot: "Full Day" });
        } else {
          if (seat.morningBooking?.isBooked) {
            tempExpanded.push({ ...seat, timeSlot: "Morning" });
          }
          if (seat.eveningBooking?.isBooked) {
            tempExpanded.push({ ...seat, timeSlot: "Evening" });
          }
        }
      });

      setExpandedSeats(tempExpanded);

      // ✨ Refresh selected seat after fetch
      if (selectedSeat) {
        const updatedSeat = tempExpanded.find(
          (s) =>
            s.seatNumber === selectedSeat.seatNumber &&
            s.timeSlot === selectedSeat.timeSlot
        );
        setSelectedSeat(updatedSeat || null);
      }
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    }
  };

  useEffect(() => {
    fetchSeats();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 p-6 sm:p-0">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">
        📚 Library Seat Booking
      </h1>

      <div className="mb-10">
        <BookingForm onSuccess={fetchSeats} />
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {expandedSeats.map((seat, index) => (
          <SeatCard
            key={`${seat._id}-${index}`}
            seat={seat}
            onClick={setSelectedSeat}
          />
        ))}
      </div>

      {selectedSeat && (
        <SeatDetail seat={selectedSeat} onUnbook={fetchSeats} />
      )}
    </div>
  );
};

export default LandingPage;
