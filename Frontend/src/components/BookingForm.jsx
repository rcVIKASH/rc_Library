import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BookingForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    phone: "",
    seatNumber: "",
    bookingSlot: "fullTime",
    monthlyFee: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/v1/bookSeat", formData);
      toast.success("Seat Booked successfully! ✅");
      onSuccess();
      setFormData({
        fullname: "",
        username: "",
        phone: "",
        seatNumber: "",
        bookingSlot: "fullTime",
        monthlyFee: "",
      });
    } catch (err) {
      console.error(err.response?.data?.message || "Booking error");
      toast.error("Seat Booked Faied! ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 text-gray-100 p-8 rounded-xl shadow-lg border border-gray-700"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📖 Book Your Seat
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="seatNumber"
          placeholder="Seat Number (1 to 55)"
          value={formData.seatNumber}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="monthlyFee"
          placeholder="Monthly Fee"
          value={formData.monthlyFee}
          onChange={handleChange}
          className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <select
          name="bookingSlot"
          value={formData.bookingSlot}
          onChange={handleChange}
          className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="fullTime">Full Time</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-medium py-2 rounded-md"
      >
        ✅ Book Seat
      </button>
    </form>
  );
};

export default BookingForm;
