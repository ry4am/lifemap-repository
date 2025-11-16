'use client';

import { useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';
import providersData from '@/data/providers.json';

// Match providers.json
type Provider = {
  provider_id: number;
  provider_name: string;
  suburb: string;
  service_categories: string[];
  phone: string | null;
  email: string | null;
  active: boolean;
};

const providers = providersData as Provider[];

type FormState = {
  title: string;
  serviceType: string;
  date: string;
  time: string;
  location: string;
  email: string;
};

export default function AppointmentsPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    serviceType: '',
    date: '',
    time: '',
    location: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const update =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // Build clean unique service categories
  const allServiceCategories = useMemo(() => {
    const set = new Set<string>();

    for (const p of providers) {
      for (const raw of p.service_categories) {
        if (!raw) continue;
        const clean = raw.trim();
        if (!clean) continue;
        const lc = clean.toLowerCase();
        if (lc.startsWith('or ') || lc.startsWith('and ')) continue;
        set.add(clean);
      }
    }

    return Array.from(set).sort();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        location: form.location,
        email: form.email, // backend ignores this now
      }),
    });

    setLoading(false);
    alert('Appointment booked successfully');
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', width: '100%' }}>
      <NavBar />

      <section
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px',
          background: '#f5f7fb',
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 24,
            border: '2px solid black',
            background: 'white',
            padding: 24,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            display: 'grid',
            gap: 12,
          }}
        >
          <h1>Book an Appointment</h1>

          <label style={labelStyle}>
            Appointment title
            <input
              type="text"
              value={form.title}
              onChange={update('title')}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Service category
            <select
              value={form.serviceType}
              onChange={update('serviceType')}
              style={inputStyle}
              required
            >
              <option value="">Select a category…</option>
              {allServiceCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ ...labelStyle, flex: 1 }}>
              Date
              <input
                type="date"
                value={form.date}
                onChange={update('date')}
                style={inputStyle}
              />
            </label>
            <label style={{ ...labelStyle, flex: 1 }}>
              Time
              <input
                type="time"
                value={form.time}
                onChange={update('time')}
                style={inputStyle}
              />
            </label>
          </div>

          <label style={labelStyle}>
            Location
            <input
              type="text"
              value={form.location}
              onChange={update('location')}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Email address (unused)
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 16px',
              borderRadius: 16,
              border: '2px solid black',
              background: '#59C3FF',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Booking…' : 'Book Appointment'}
          </button>
        </form>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: 14,
  gap: 4,
};

const inputStyle: React.CSSProperties = {
  borderRadius: 12,
  border: '2px solid black',
  padding: '8px 10px',
  fontSize: 14,
};
