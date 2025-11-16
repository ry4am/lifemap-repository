'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';

type Appointment = {
  id: number;
  service: string;
  suburb: string;      // using as location
  day: string;         // "YYYY-MM-DD"
  time: string;        // "HH:MM"
  provider_name: string;
  state: string;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments once
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/appointments');
        if (!res.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await res.json();
        setAppointments(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? 'Error loading appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Group them by day string "YYYY-MM-DD"
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appt of appointments) {
      const key = appt.day;
      if (!map[key]) map[key] = [];
      map[key].push(appt);
    }
    return map;
  }, [appointments]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startWeekDay = firstDayOfMonth.getDay(); // 0-6

  const weeks: { date: Date | null }[][] = [];
  let currentDay = 1 - startWeekDay;

  while (currentDay <= daysInMonth) {
    const week: { date: Date | null }[] = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push({ date: null });
      } else {
        week.push({ date: new Date(year, month, currentDay) });
      }
      currentDay++;
    }
    weeks.push(week);
  }

  const goPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthLabel = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to build local "YYYY-MM-DD" (no UTC conversion)
  const toLocalDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <NavBar />

      <section
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px',
          background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 24,
            padding: 24,
            maxWidth: 800,
            width: '100%',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <button onClick={goPrevMonth} style={buttonStyle} type="button">
              &lt; Prev
            </button>

            <h2 style={{ margin: 0 }}>{monthLabel}</h2>

            <button onClick={goNextMonth} style={buttonStyle} type="button">
              Next &gt;
            </button>
          </div>

          {loading && (
            <p style={{ marginTop: 0, marginBottom: 8, fontSize: 12, opacity: 0.7 }}>
              Loading appointments…
            </p>
          )}
          {error && (
            <p style={{ marginTop: 0, marginBottom: 8, fontSize: 12, color: 'red' }}>
              {error}
            </p>
          )}

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
            }}
          >
            {weekDays.map(d => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  fontWeight: 600,
                  paddingBottom: 4,
                  borderBottom: '1px solid #ddd',
                }}
              >
                {d}
              </div>
            ))}

            {weeks.map((week, wi) =>
              week.map((cell, di) => {
                if (!cell.date) {
                  return <div key={`${wi}-${di}`} />;
                }

                const d = cell.date;
                const dayNum = d.getDate();
                const dateKey = toLocalDateKey(d); // 👈 local date key
                const dayAppointments = appointmentsByDate[dateKey] || [];

                return (
                  <div
                    key={`${wi}-${di}`}
                    style={{
                      minHeight: 64,
                      borderRadius: 12,
                      padding: 6,
                      border: '1px solid #eee',
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{dayNum}</div>

                    {dayAppointments.slice(0, 3).map(appt => (
                      <div key={appt.id} style={{ marginBottom: 2, lineHeight: 1.2 }}>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>
                          {appt.service}
                        </span>
                        {appt.suburb && (
                          <span style={{ color: '#16a34a' }}>
                            {' · '}
                            {appt.suburb}
                          </span>
                        )}
                        {appt.time && (
                          <span style={{ color: '#000' }}>
                            {' · '}
                            {appt.time}
                          </span>
                        )}
                      </div>
                    ))}

                    {dayAppointments.length > 3 && (
                      <span style={{ fontSize: 10, opacity: 0.7 }}>
                        +{dayAppointments.length - 3} more
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 12, fontSize: 12 }}>
            <strong>Legend:</strong>{' '}
            <span style={{ color: '#2563eb' }}>Blue = Service Type</span>{' '}
            <span style={{ color: 'red', marginLeft: 8 }}>Red = Urgent</span>{' '}
            <span style={{ color: '#16a34a', marginLeft: 8 }}>Green = Location</span>{' '}
            <span style={{ marginLeft: 8 }}>Black = Time / Standard Task</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '2px solid black',
  background: '#59C3FF',
  fontWeight: 600,
  cursor: 'pointer',
};
