"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState
    "loading" | "ask" | "happy" | "unhappy" | "done"
  >("loading");
  const [feedback, setFeedback] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    async function load() {
      const { data: booking } = await supabase
        .from("bookings")
        .select("business_id")
        .eq("id", params.id)
        .single();

      if (!booking) {
        setStep("ask");
        return;
      }

      const { data: business } = await supabase
        .from("businesses")
        .select("business_name, google_review_link")
        .eq("id", booking.business_id)
        .single();

      setBusinessName(business?.business_name ?? "us");
      setReviewLink(business?.google_review_link ?? "#");
      setStep("ask");
    }
    load();
  }, [params.id]);

  async function sendFeedback() {
    await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: params.id, feedback }),
    });
    setStep("done");
  }

  if (step === "loading") {
    return (
      <div className="page" style={{ maxWidth: 420 }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      {step === "ask" && (
        <div className="card">
          <p>Thanks for renting from {businessName}! How did everything go?</p>
          <div className="form-row">
            <button onClick={() => setStep("happy")}>Great</button>
            <button onClick={() => setStep("unhappy")}>Not great</button>
          </div>
        </div>
      )}

      {step === "happy" && (
        <div className="card">
          <p>Glad to hear it! Mind leaving a quick review?</p>
          <a href={reviewLink} target="_blank" rel="noreferrer">
            <button>Leave a Google review</button>
          </a>
        </div>
      )}

      {step === "unhappy" && (
        <div className="card">
          <p>Sorry to hear that. Tell us what happened so we can fix it.</p>
          <textarea
            rows={4}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #d6d3c9",
              marginBottom: 10,
            }}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button onClick={sendFeedback}>Send privately</button>
          <p style={{ fontSize: 12, color: "#6b6b6b", marginTop: 8 }}>
            This goes straight to the business, not a public review.
          </p>
        </div>
      )}

      {step === "done" && (
        <div className="card">
          <p>Thanks for letting us know — we&apos;ll follow up.</p>
        </div>
      )}
    </div>
  );
}
