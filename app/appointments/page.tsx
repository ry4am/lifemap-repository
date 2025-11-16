'use client';

import { useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';
import providersData from '@/data/providers.json';

type Provider = {
  id: string;
  provider_name: string;
  service_categories: string[];   // 👈 UPDATED
  suburb: string;
  state: string;
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

  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const update =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // Filter providers by service type using service_categories[]
  const filteredProviders = useMemo(() => {
    if (!form.serviceType) return providers;
    return providers.filter(p =>
      p.service_categories.some(cat =>
        cat.toLowerCase() === form.serviceType.toLowerCase()
      )
    );
  }, [form.serviceType]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const provider = providers.find(p => p.id === selectedProviderId);

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: form.title || form.serviceType || 'Appointment',
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        location: form.location,
        providerId: provider?.id ?? '',
        providerName: provider?.provider_name ?? '',
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
      setSelectedProviderId('');
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

          {/* Title */}
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

          {/* Service type */}
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

          {/* Notes / location */}
          <label style={labelStyle}>
            Location (optional notes)
            <input
              type="text"
              placeholder="e.g. Home visit, Telehealth"
              value={form.location}
              onChange={update('location')}
              style={inputStyle}
            />
          </label>

          {/* Provider list */}
          <label style={labelStyle}>
            NDIS Provider
            <select
              value={selectedProviderId}
              onChange={e => setSelectedProviderId(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              required
            >
              <option value="">Select a provider…</option>
              {filteredProviders.map(p => (
                <option key={p.id} value={p.id}>
                  {p.provider_name} – {p.suburb}, {p.state} ({p.service_categories.join(', ')})
                </option>
              ))}
            </select>
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
