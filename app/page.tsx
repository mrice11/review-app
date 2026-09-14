"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Booking } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEverything() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUserId(session.user.id);

    const { data: business } = await supabase
      .from("businesses")
      .select("business_name")
      .eq("id", session.user.id)
      .single();

    setBusinessName(business?.business_name ?? "Your business");

    const { data: bookingRows } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    setBookings(bookingRows ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadEverything();
  }, []);

  async function addBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !date || !userId) return;

    await supabase.from("bookings").insert({
      business_id: userId,
      customer_name: name,
      customer_email: email,
      event_date: date,
      status: "awaiting",
    });

    setName("");
    setEmail("");
    setDate("");
    loadEverything();
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
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
          <h1>{businessName}</h1>
          <p>Add a booking, we handle the rest.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/settings">
            <button style={{ background: "#e5e3dc", color: "#1a1a1a" }}>
              Settings
            </button>
          </a>
          <button
            onClick={signOut}
            style={{ background: "#e5e3dc", color: "#1a1a1a" }}
          >
            Log out
          </button>
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
        {bookings.length === 0 ? (
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
