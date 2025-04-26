import React from "react";
import dayjs from "dayjs";

const blinkClass = `
  animate-pulse text-red-900 font-bold
`;

export default function SeatCard({ seat, onClick }) {
  const color = () => {
    if (seat.fullTimeBooking?.isBooked) return "bg-green-300";
    if (seat.morningBooking?.isBooked) return "bg-yellow-300";
    if (seat.eveningBooking?.isBooked) return "bg-pink-300";
    return "bg-gray-600";
  };

  const getRemainingDays = () => {
    let user = null;
    if (seat.fullTimeBooking?.users?.[0]) user = seat.fullTimeBooking.users[0];
    if (seat.morningBooking?.users?.[0]) user = seat.morningBooking.users[0];
    if (seat.eveningBooking?.users?.[0]) user = seat.eveningBooking.users[0];

    if (!user || !user.createdAt) return null;

    const joiningDate = dayjs(user.createdAt);
    const dueDate = joiningDate.add(1, "month");
    const today = dayjs();
    const remainingDays = dueDate.diff(today, "day");

    return remainingDays;
  };

  const remainingDays = getRemainingDays();

  return (
    <div
      onClick={() => onClick(seat)}
      className={`w-48 h-24 p-3 rounded-lg cursor-pointer shadow-md transition-transform transform hover:scale-105 ${color()}`}
    >
      <p className="text-cyan-950 font-semibold text-lg">
        <strong>Seat Number: </strong> {seat.seatNumber}
      </p>

      {seat.timeSlot && (
        <p className="text-sm text-cyan-950 mt-1">
          <strong>Time Slot:</strong> {seat.timeSlot}
        </p>
      )}

      {remainingDays !== null && (
        <p
          className={`text-sm mt-1 ${
            remainingDays <= 0 ? blinkClass : "text-cyan-950"
          }`}
        >
          {remainingDays > 0
            ? `Fee due in ${remainingDays} days`
            : `Fee overdue!`}
        </p>
      )}
    </div>
  );
}
