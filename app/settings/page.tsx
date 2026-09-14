"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("businesses")
        .select("business_name, google_review_link, webhook_token")
        .eq("id", session.user.id)
        .single();

      setBusinessName(data?.business_name ?? "");
      setReviewLink(data?.google_review_link ?? "");
      if (data?.webhook_token) {
        setWebhookUrl(
          `${window.location.origin}/api/webhook/${data.webhook_token}`
        );
      }
      setLoading(false);
    }
    load();
  }, [router]);

  function copyWebhookUrl() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("businesses")
      .update({
        business_name: businessName,
        google_review_link: reviewLink,
      })
      .eq("id", session.user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 500 }}>
      <div className="header">
        <div>
          <h1>Settings</h1>
        </div>
        <a href="/">
          <button style={{ background: "#e5e3dc", color: "#1a1a1a" }}>
            Back
          </button>
        </a>
      </div>

      <div className="card">
        <form onSubmit={save}>
          <label style={{ fontSize: 13, color: "#6b6b6b" }}>
            Business name
          </label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{ width: "100%", marginBottom: 14, marginTop: 4 }}
          />

          <label style={{ fontSize: 13, color: "#6b6b6b" }}>
            Google review link
          </label>
          <input
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
            placeholder="https://g.page/r/..."
            style={{ width: "100%", marginBottom: 6, marginTop: 4 }}
          />
          <p style={{ fontSize: 12, color: "#6b6b6b", marginTop: 0 }}>
            Search Google for &quot;[your business name] get more reviews
            link&quot; or find it in your Google Business Profile.
          </p>

          <button type="submit">Save</button>
          {saved && (
            <span style={{ marginLeft: 10, fontSize: 13, color: "#3b6d11" }}>
              Saved!
            </span>
          )}
        </form>
      </div>

      <div className="card">
        <p style={{ fontWeight: 500, marginTop: 0 }}>
          Skip manual entry with Zapier
        </p>
        <p style={{ fontSize: 13, color: "#6b6b6b" }}>
          Connect this address in a Zapier automation (or Make, n8n) so new
          bookings from QuickBooks, Square, or whatever you already use get
          added here automatically. Set the trigger to whatever tool creates
          your bookings, and the action to &quot;Webhooks - POST&quot; using
          this URL.
        </p>
        <div className="form-row">
          <input readOnly value={webhookUrl} style={{ fontSize: 12 }} />
          <button onClick={copyWebhookUrl}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#a32d2d", marginBottom: 0 }}>
          Keep this link private — anyone who has it can add bookings to
          your account.
        </p>
      </div>
    </div>
  );
}
