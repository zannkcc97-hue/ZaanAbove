"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal login.");
        setLoading(false);
        return;
      }
      router.push("/chat");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Zaan Above</div>
        <div className="auth-sub">Masuk untuk lanjut mengobrol</div>

        {justRegistered && (
          <div
            className="auth-error"
            style={{
              background: "rgba(84,104,245,0.12)",
              borderColor: "rgba(84,104,245,0.35)",
              color: "#9db0ff",
            }}
          >
            Pendaftaran berhasil, silakan masuk.
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="field-label">Username</label>
          <input
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username kamu"
            required
          />

          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password kamu"
            required
          />

          <button className="btn-primary" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun? <Link href="/register">Daftar</Link>
        </div>
      </div>
    </div>
  );
}
