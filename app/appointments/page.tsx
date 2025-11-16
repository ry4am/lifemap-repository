'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.title || form.serviceType || 'Appointment',
        serviceType: form.serviceType,
        date: form.date,       // send raw date "YYYY-MM-DD"
        time: form.time,       // send raw time "HH:MM" (24h)
        location: form.location,
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
          <h1 style={{ margin: '0 0 8px' }}>Book an Appointment</h1>
          <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.8 }}>
            Tell LifeMap what you need help with and when. This will create an appointment entry
            that can later be surfaced in your calendar and reminder emails.
          </p>

          <label style={labelStyle}>
            Appointment title
            <input
              type="text"
              placeholder="e.g. Speech therapy session"
              value={form.title}
              onChange={update('title')}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Service type
            <select
              value={form.serviceType}
              onChange={update('serviceType')}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              <option value="">Select a service…</option>
              <option value="Support Worker">Support Worker</option>
              <option value="Daily Tasks">Daily Tasks</option>
              <option value="Speech Therapy">Speech Therapy</option>
              <option value="Occupational Therapy">Occupational Therapy</option>
              <option value="Community Participation">Community Participation</option>
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

          <label style={labelStyle}>
            Location
            <input
              type="text"
              placeholder="e.g. Melbourne NDIS Centre"
              value={form.location}
              onChange={update('location')}
              style={inputStyle}
            />
          </label>

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
  outline: 'none',
};
