'use client';

import { useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';
import providersData from '@/data/providers.json';

// Match providers.json shape
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
};

export default function AppointmentsPage() {
  const [form, setForm] = useState<FormState>({
    title: '',
    serviceType: '',
    date: '',
    time: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);

  const update =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // Build a unique, cleaned list of all service categories from JSON
  const allServiceCategories = useMemo(() => {
    const set = new Set<string>();

    for (const p of providers) {
      for (const raw of p.service_categories) {
        if (!raw) continue;
        const clean = raw.trim();
        if (!clean) continue;

        const lc = clean.toLowerCase();

        // Heuristic: skip fragments like "or education", "or maintain employment and"
        if (lc.startsWith('or ') || lc.startsWith('and ')) continue;

        set.add(clean);
      }
    }

    return Array.from(set).sort();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.title || form.serviceType || 'Appointment',
        serviceType: form.serviceType,
        date: form.date,      // "YYYY-MM-DD"
        time: form.time,      // "HH:MM" 24h
        location: form.location,
        // provider chosen by AI on the server
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert('Appointment booked successfully');
      setForm({
        title: '',
        serviceType: '',
        date: '',
        time: '',
        location: '',
      });
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to create appointment');
    }
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        width: '100%',
      }}
    >
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
            boxSizing: 'border-box',
          }}
        >
          <h1 style={{ margin: '0 0 8px' }}>Book an Appointment</h1>
          <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.8 }}>
            Tell LifeMap what you need help with and when. The AI will pick the most suitable NDIS
            provider for you based on your service category and location.
          </p>

          {/* Title */}
          <label style={labelStyle}>
            Appointment title
            <input
              type="text"
              placeholder="e.g. Plan Management review"
              value={form.title}
              onChange={update('title')}
              style={inputStyle}
            />
          </label>

          {/* Service category */}
          <label style={labelStyle}>
            Service category
            <select
              value={form.serviceType}
              onChange={update('serviceType')}
              style={{ ...inputStyle, cursor: 'pointer' }}
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

          {/* Date & time */}
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ ...labelStyle, flex: 1 }}>
              Date
              <input
                type="date"
                value={form.date}
                onChange={update('date')}
                style={inputStyle}
                required
              />
            </label>
            <label style={{ ...labelStyle, flex: 1 }}>
              Time
              <input
                type="time"
                value={form.time}
                onChange={update('time')}
                style={inputStyle}
                required
              />
            </label>
          </div>

          {/* Location / notes */}
          <label style={labelStyle}>
            Location (suburb or notes)
            <input
              type="text"
              placeholder="e.g. Melbourne, home visit, Telehealth"
              value={form.location}
              onChange={update('location')}
              style={inputStyle}
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '10px 16px',
              borderRadius: 16,
              border: '2px solid black',
              background: '#59C3FF',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {loading ? 'Finding provider…' : 'Book Appointment'}
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
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
