'use client';

import { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/NavBar';

type Booking = { date: string; text: string; type: 'service-type' | 'urgent' | 'location' | 'standard' };

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarPage() {
  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState<number>(now.getMonth());
  const [year, setYear] = useState<number>(now.getFullYear());

  // Seed demo bookings from localStorage (same as your HTML page)
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const seeded =
      (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('appointments') || 'null')) ||
      [
        { date: '2025-10-05', text: 'Cleaning Service',        type: 'service-type' },
        { date: '2025-10-07', text: 'Medical Appointment',     type: 'urgent' },
        { date: '2025-10-07', text: 'Clinic - Sydney',         type: 'location' },
        { date: '2025-10-12', text: 'Standard Check-in',       type: 'standard' },
        { date: '2025-10-18', text: 'Support Worker Visit',    type: 'service-type' },
        { date: '2025-10-18', text: 'Urgent Medication Refill',type: 'urgent' },
        { date: '2025-10-18', text: 'Pharmacy - Melbourne',    type: 'location' },
      ];
    setBookings(seeded);
  }, []);

  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  const goPrev = () => {
    setMonth(m => {
      if (m === 0) { setYear(y => y - 1); return 11; }
      return m - 1;
    });
  };
  const goNext = () => {
    setMonth(m => {
      if (m === 11) { setYear(y => y + 1); return 0; }
      return m + 1;
    });
  };

  // Build a 7x6 grid (headers + days + trailing blanks)
  const dayCells = [];
  // headers
  for (const d of daysOfWeek) {
    dayCells.push(
      <div key={`h-${d}`} className="day-header">{d}</div>
    );
  }
  // leading blanks
  for (let i = 0; i < firstDay; i++) {
    dayCells.push(<div key={`e-start-${i}`} className="day" />);
  }
  // days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayBookings = bookings.filter(b => b.date === dateStr);
    dayCells.push(
      <div key={`d-${d}`} className="day">
        <strong>{d}</strong>
        {dayBookings.map((b, idx) => (
          <p key={idx} className={b.type}>{b.text}</p>
        ))}
      </div>
    );
  }
  // trailing blanks to fill 7x6 grid (42 cells excluding headers)
  const totalCells = firstDay + daysInMonth;
  const remaining = 42 - totalCells;
  for (let i = 0; i < remaining; i++) {
    dayCells.push(<div key={`e-end-${i}`} className="day" />);
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', width: '100%' }}>
      <NavBar />

      <section className="wrap">
        <div className="calendar-container">
          <div className="month-selector">
            <button onClick={goPrev}>&lt; Prev</button>
            <h2>{monthNames[month]} {year}</h2>
            <button onClick={goNext}>Next &gt;</button>
          </div>

          <div className="calendar">
            {dayCells}
          </div>

          <div className="legend">
            <strong>Legend:</strong><br />
            <span className="service-type">Blue = Service Type</span>
            <span className="urgent">Red = Urgent</span>
            <span className="location">Green = Location</span>
            <span className="standard">Black = Standard Task</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .wrap{
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
        }
        .calendar-container {
          background-color: #fff;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          padding: 20px;
          width: 95%;
          max-width: 900px;
        }
        .month-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .month-selector button {
          background-color: #2575fc;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background .3s;
        }
        .month-selector button:hover { background-color: #1e63d1; }
        .month-selector h2 { margin: 0; color: #333; }

        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          text-align: left;
        }
        .day-header {
          font-weight: bold;
          background-color: #2575fc;
          color: white;
          padding: 8px;
          border-radius: 8px;
          text-align: center;
        }
        .day {
          background-color: #f8f8f8;
          border-radius: 8px;
          padding: 10px;
          min-height: 100px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .day strong { display:block; margin-bottom:5px; color:#333; }

        /* Colour coding */
        .service-type { color: blue; font-weight: bold; }
        .urgent { color: red; font-weight: bold; }
        .location { color: green; }
        .standard { color: black; }

        .legend {
          margin-top: 20px;
          text-align: left;
          font-size: 14px;
        }
        .legend span { margin-right: 20px; }

        @media (max-width: 700px) {
          .calendar { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}
