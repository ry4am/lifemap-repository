'use client';

import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';

type Appointment = {
  id: number;
  service: string;
  suburb: string;      // we’re using this as “location”
  day: string;         // "YYYY-MM-DD"
  time: string;        // "HH:MM"
  provider_name: string;
  state: string;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start at “today’s” month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments once on mount
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

  // Map of date -> appointments[] for quick lookup
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};

    for (const appt of appointments) {
      // appt.day is "YYYY-MM-DD"
      const key = appt.day;
      if (!map[key]) map[key] = [];
      map[key].push(appt);
    }

    return map;
  }, [appointments]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Day of week for the 1st (0=Sun,...6=Sat)
  const startWeekDay = firstDayOfMonth.getDay();

  // Build an array of weeks, each week = array of 7 “cells”
  const weeks: { date: Date | null }[][] = [];
  let currentDay = 1 - startWeekDay; // may start negative: empty cells

  while (currentDay <= daysInMonth) {
    const week: { date: Date | null }[] = [];

    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push({ date: null }); // outside current month
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
          {/* Header + controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <button
              onClick={goPrevMonth}
              style={buttonStyle}
              type="button"
            >
              &lt; Prev
            </button>

            <h2 style={{ margin: 0 }}>{monthLabel}</h2>

            <button
              onClick={goNextMonth}
              style={buttonStyle}
              type="button"
            >
              Next &gt;
            </button>
          </div>

          {/* Status line */}
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

          {/* Calendar grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
            }}
          >
            {/* Weekday headings */}
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

            {/* Month days */}
            {weeks.map((week, wi) =>
              week.map((cell, di) => {
                if (!cell.date) {
                  return <div key={`${wi}-${di}`} />; // empty
                }

                const d = cell.date;
                const dayNum = d.getDate();
                const dateKey = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
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

                    {/* Appointments for this day */}
                    {dayAppointments.slice(0, 3).map(appt => (
                      <div key={appt.id} style={{ marginBottom: 2, lineHeight: 1.2 }}>
                        {/* Blue = Service Type */}
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>
                          {appt.service}
                        </span>

                        {/* Green = Location (suburb) */}
                        {appt.suburb && (
                          <span style={{ color: '#16a34a' }}>
                            {' · '}
                            {appt.suburb}
                          </span>
                        )}

                        {/* Time in black */}
                        {appt.time && (
                          <span style={{ color: '#000' }}>
                            {' · '}
                            {appt.time}
                          </span>
                        )}
                      </div>
                    ))}

                    {/* If more than 3 appts, show "+n more" */}
                    {dayAppointments.length > 3 && (
                      <span style={{ fontSize: 10, opacity: 0.7 }}>
                        +{dayAppointments.length - 3} more
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 12, fontSize: 12 }}>
            <strong>Legend:</strong>{' '}
            <span style={{ color: '#2563eb' }}>Blue = Service Type</span>{' '}
            <span style={{ color: 'red', marginLeft: 8 }}>Red = Urgent (future)</span>{' '}
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
