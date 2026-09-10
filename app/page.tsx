"use client";

import { useEffect, useState } from "react";
import { supabase, Booking } from "@/lib/supabase";

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function addBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !date) return;

    await supabase.from("bookings").insert({
      customer_name: name,
      customer_email: email,
      event_date: date,
      status: "awaiting",
    });

    setName("");
    setEmail("");
    setDate("");
    loadBookings();
  }

  const reviewed = bookings.filter((b) => b.status === "reviewed").length;
  const pending = bookings.filter(
    (b) => b.status === "awaiting" || b.status === "sent"
  ).length;
  const flagged = bookings.filter((b) => b.status === "flagged").length;

  return (
    <div className="page">
      <div className="header">
        <div>
          <h1>Review requests</h1>
          <p>Add a booking, we handle the rest.</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="label">Reviews collected</div>
          <div className="value">{reviewed}</div>
        </div>
        <div className="stat">
          <div className="label">Pending</div>
          <div className="value">{pending}</div>
        </div>
        <div className="stat">
          <div className="label">Flagged</div>
          <div className="value">{flagged}</div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={addBooking}>
          <div className="form-row">
            <input
              placeholder="Customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Customer email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Add booking</button>
          </div>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings yet. Add your first one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.customer_name}</td>
                  <td>{b.event_date}</td>
                  <td>
                    <span className={`badge ${b.status}`}>
                      {b.status === "awaiting" && "Awaiting event"}
                      {b.status === "sent" && "Request sent"}
                      {b.status === "reviewed" && "Review left"}
                      {b.status === "flagged" && "Flagged - unhappy"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
