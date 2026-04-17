"use client";

import React, { useState } from 'react';

const API_URL = "https://hair-and-skin-backend.onrender.com";

export default function BookingPage() {
  const [service, setService] = useState('Haircut');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const saveBooking = async () => {
    setLoading(true); // ✅ moved here

    try {
      const res = await fetch(`${API_URL}/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service, date, time }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Booking saved!");
      } else {
        alert(data.message || "Error saving booking");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-md mx-auto p-8 bg-[#1a1a1a] border border-gray-800 shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#d4b78f]">
          Book Your Visit
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Select Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 bg-[#222] border border-gray-700 rounded-lg text-white outline-none focus:border-[#d4b78f]"
            >
              <option>Majirel Global Color</option>
              <option>Standard Haircut</option>
              <option>Beard Trim</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Pick a Date
            </label>
            <input
              type="date"
              required
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-[#222] border border-gray-700 rounded-lg text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">
              Preferred Time
            </label>
            <input
              type="time"
              required
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-[#222] border border-gray-700 rounded-lg text-white outline-none"
            />
          </div>

          <button
            type="button"
            onClick={saveBooking}
            disabled={loading}
            className="w-full bg-[#d4b78f] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}