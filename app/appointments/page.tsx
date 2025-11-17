'use client';

import React, { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import NavBar from '@/components/NavBar';
import providersData from '@/data/providers.json';

export const dynamic = 'force-dynamic';

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
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status ?? 'unauthenticated';

  const [form, setForm] = useState<FormState>({
    title: '',
    serviceType: '',
    date: '',
    time: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);

  const loggedInEmail = session?.user?.email ?? '';
  const loggedInName = session?.user?.name ?? '';
  const isAuthenticated = status === 'authenticated';

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

        let lc = clean.toLowerCase();

        // Skip obvious fragments like "or education", "or maintain employment and"
        if (lc.startsWith('or ') || lc.startsWith('and ')) continue;

        if (
          lc === 'assistance to access and' ||
          lc === 'assistance to access and maintain employment and'
        ) {
          const full =
            'Assistance to access and maintain employment and/or education';
          set.add(full);
          continue;
        }

        set.add(clean);
      }
    }

    return Array.from(set).sort();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please log in to book an appointment.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.title || form.serviceType || 'Appointment',
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        location: form.location,
      }),
    });

    const data = await res.json().catch(() => null);
    setLoading(false);

    console.log('Appointment API response:', data);

    if (res.ok) {
      alert(
        `Appointment booked. A confirmation email has been sent to your account email.`
      );
      setForm({
        title: '',
        serviceType: '',
        date: '',
        time: '',
        location: '',
      });
    } else {
      alert(data?.error || 'Failed to create appointment');
      console.error('Appointment error:', data);
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
        <div
          style={{
            width: '100%',
            maxWidth: 600,
          }}
        >
          {/* Session banner */}
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 16,
              border: '1px solid #ddd',
              background:
                status === 'authenticated'
                  ? '#ecfdf5'
                  : status === 'loading'
                  ? '#eff6ff'
                  : '#fef2f2',
              fontSize: 14,
            }}
          >
            {status === 'loading' && <span>Checking your session…</span>}

            {status === 'unauthenticated' && (
              <span>
                You are not logged in. Please sign in to book appointments so we
                can email your confirmation to your account.
              </span>
            )}

            {status === 'authenticated' && (
              <span>
                Booking as{' '}
                <strong>
                  {loggedInName ? `${loggedInName} (${loggedInEmail})` : loggedInEmail}
                </strong>
                .
                <span style={{ marginLeft: 6, opacity: 0.8 }}>
                  Your confirmation will be sent to this email.
                </span>
              </span>
            )}
          </div>

          {/* Form card */}
          <form
            onSubmit={onSubmit}
            style={{
              width: '100%',
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
              Tell LifeMap what you need help with and when. The AI will select
              the most suitable NDIS provider, and a confirmation email will be
              sent to the email on your LifeMap account.
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

            {/* Location */}
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
              disabled={loading || !isAuthenticated}
              style={{
                marginTop: 8,
                padding: '10px 16px',
                borderRadius: 16,
                border: '2px solid black',
                background: !isAuthenticated ? '#d4d4d4' : '#59C3FF',
                fontWeight: 700,
                cursor: !isAuthenticated ? 'not-allowed' : 'pointer',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {loading
                ? 'Booking…'
                : !isAuthenticated
                ? 'Log in to book'
                : 'Book Appointment'}
            </button>
          </form>
        </div>
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
