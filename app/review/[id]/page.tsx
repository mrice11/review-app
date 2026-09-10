"use client";

import { useState } from "react";

// Replace with your actual Google review link (see README.md step 5).
const GOOGLE_REVIEW_LINK = "https://g.page/r/REPLACE_ME/review";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState<"ask" | "happy" | "unhappy" | "done">(
    "ask"
  );
  const [feedback, setFeedback] = useState("");

  async function respond(status: "happy" | "unhappy") {
    setStep(status);
  }

  async function sendFeedback() {
    await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: params.id, feedback }),
    });
    setStep("done");
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      {step === "ask" && (
        <div className="card">
          <p>Thanks for renting from us! How did everything go?</p>
          <div className="form-row">
            <button onClick={() => respond("happy")}>Great</button>
            <button onClick={() => respond("unhappy")}>Not great</button>
          </div>
        </div>
      )}

      {step === "happy" && (
        <div className="card">
          <p>Glad to hear it! Mind leaving us a quick review?</p>
          <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer">
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
          <p>Thanks for letting us know — we'll follow up.</p>
        </div>
      )}
    </div>
  );
}
