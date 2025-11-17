'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at top, #020617 0, #020617 40%, #020617 100%)',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
};

const cardStyle: React.CSSProperties = {
  width: '420px',
  maxWidth: '90vw',
  padding: '32px',
  borderRadius: '24px',
  background: 'rgba(15, 23, 42, 0.98)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  boxShadow:
    '0 18px 45px rgba(15, 23, 42, 0.85), 0 0 0 1px rgba(15, 23, 42, 0.9)',
  color: '#e5e7eb',
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '6px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '13px',
  textAlign: 'center',
  color: '#9ca3af',
  marginBottom: '24px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  marginBottom: '6px',
  color: '#e5e7eb',
};

const inputWrapperStyle: React.CSSProperties = {
  marginBottom: '14px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  borderRadius: '10px',
  border: '1px solid rgba(55, 65, 81, 0.9)',
  backgroundColor: '#020617',
  color: '#e5e7eb',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '10px',
  padding: '10px 12px',
  borderRadius: '999px',
  border: 'none',
  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
  color: 'white',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 10px 25px rgba(79, 70, 229, 0.55)',
};

const buttonDisabledStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.6,
  cursor: 'default',
  boxShadow: 'none',
};

const footerTextStyle: React.CSSProperties = {
  marginTop: '14px',
  fontSize: '12px',
  textAlign: 'center',
  color: '#9ca3af',
};

const linkStyle: React.CSSProperties = {
  color: '#a855f7',
  textDecoration: 'none',
  fontWeight: 500,
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    ndisId: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.email !== form.confirmEmail) {
      alert("Emails don't match");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          // you can also send ndisId if you decide to store it
          // ndisId: form.ndisId,
        }),
      });

      if (res.ok) {
        alert('Account created. Please log in.');
        router.push('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={pageStyle}>
      <form onSubmit={onSubmit} style={cardStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Sign up to start using your dashboard</p>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>Full name</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={update('fullName')}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>NDIS ID (optional)</label>
          <input
            type="text"
            value={form.ndisId}
            onChange={update('ndisId')}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>Confirm email</label>
          <input
            type="email"
            required
            value={form.confirmEmail}
            onChange={update('confirmEmail')}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapperStyle}>
          <label style={labelStyle}>Confirm password</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={loading ? buttonDisabledStyle : buttonStyle}
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p style={footerTextStyle}>
          Already have an account?{' '}
          <Link href="/login" style={linkStyle}>
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
