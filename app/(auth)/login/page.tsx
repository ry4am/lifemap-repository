'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="wrap">
      <section className="card">
        <h1 className="title">Login</h1>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="btn primary">Login</button>
          <button type="button" className="btn google">
            {/* replace with real handler later */}
            Login with Google
          </button>

          <p className="muted">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="link">Create one</Link>
          </p>
        </form>
      </section>

      <style jsx>{`
        :root {
          --bg: #0f1115;
          --panel: #171a21;
          --panel-2: #1d2230;
          --text: #e6e8ee;
          --muted: #aab1c6;
          --accent: #4f79ff;
          --accent-2: #6aa2ff;
          --ring: rgba(79, 121, 255, 0.35);
          --danger: #e5484d;
        }
        .wrap {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          background: radial-gradient(1200px 600px at 10% -20%, #1a2235 10%, transparent 60%),
                      radial-gradient(900px 500px at 110% 10%, #1a2235 10%, transparent 60%),
                      var(--bg);
          padding: 24px;
        }
        .card {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, var(--panel), var(--panel-2));
          border: 1px solid #262c3f;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        }
        .title {
          margin: 0 0 12px;
          color: var(--text);
          font-weight: 700;
          font-size: 24px;
          letter-spacing: 0.2px;
        }
        .form {
          display: grid;
          gap: 12px;
        }
        label {
          color: var(--muted);
          font-size: 13px;
        }
        input {
          background: #0f1422;
          color: var(--text);
          border: 1px solid #29324a;
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
          transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
        }
        input::placeholder { color: #7e879d; }
        input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--ring);
          background: #0d1320;
        }
        .btn {
          width: 100%;
          border: 0;
          border-radius: 10px;
          padding: 12px 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .02s ease, filter .15s ease, background .15s ease;
        }
        .btn:active { transform: translateY(1px); }
        .primary {
          background: linear-gradient(180deg, var(--accent), var(--accent-2));
          color: white;
        }
        .google {
          background: #ffffff10;
          color: var(--text);
          border: 1px solid #2a3350;
        }
        .muted {
          margin-top: 4px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
        }
        .link {
          color: var(--accent-2);
          text-decoration: none;
        }
        .link:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}
