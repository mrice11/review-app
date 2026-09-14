
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
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
          <h1>Log in</h1>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleLogin}>
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
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        {error && (
          <p style={{ color: "#a32d2d", fontSize: 13, marginTop: 10 }}>
            {error}
          </p>
        )}
        <p style={{ fontSize: 13, marginTop: 14 }}>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
