"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    // Create the matching business row for this new user.
    const { error: insertError } = await supabase.from("businesses").insert({
      id: data.user.id,
      business_name: businessName,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="page" style={{ maxWidth: 400 }}>
      <div className="header">
        <div>
          <h1>Create your account</h1>
          <p>Start sending automatic review requests.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSignup}>
          <input
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
            required
          />
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        {error && (
          <p style={{ color: "#a32d2d", fontSize: 13, marginTop: 10 }}>
            {error}
          </p>
        )}
        <p style={{ fontSize: 13, marginTop: 14 }}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
