'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    ndisId: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
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
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      }),
    });
    setLoading(false);

    if (res.ok) {
      alert('Account created. Please log in.');
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to create account');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={onSubmit} style={{ border: '2px solid black', borderRadius: 20, padding: 24, width: 420 }}>
        <h1 style={{ marginBottom: 16 }}>Create Account</h1>

        <label>
          Full name
          <input type="text" value={form.fullName} onChange={update('fullName')} required />
        </label>
        <label>
          NDIS ID
          <input type="text" value={form.ndisId} onChange={update('ndisId')} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Confirm email
          <input type="email" value={form.confirmEmail} onChange={update('confirmEmail')} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={update('password')} required />
        </label>
        <label>
          Confirm password
          <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p style={{ marginTop: 12 }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
