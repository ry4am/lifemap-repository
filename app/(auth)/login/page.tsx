"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="login-container">
      <div className="login-card">
        <h1 className="title">Login</h1>
        <p className="subtitle">Sign in to access your dashboard</p>

        <form onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />

          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />

          <button type="submit" disabled={loading} className="button">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="footer">
            Don’t have an account? <Link href="/register">Create one</Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a; /* dark dashboard background */
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: #f1f5f9;
        }

        .title {
          font-size: 1.8rem;
          margin-bottom: 4px;
          font-weight: 600;
          text-align: center;
        }

        .subtitle {
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .input {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 16px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #0f172a;
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .input:focus {
          border: 1px solid #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }

        .button {
          width: 100%;
          background: #6366f1;
          border: none;
          padding: 12px;
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .button:hover:not(:disabled) {
          background: #4f46e5;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);
        }

        .button:disabled {
          background: #475569;
          cursor: not-allowed;
        }

        .footer {
          margin-top: 14px;
          text-align: center;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .footer a {
          color: #818cf8;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
