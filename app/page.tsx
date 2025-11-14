'use client';

import React, { type CSSProperties } from 'react';
import NavBar from '@/components/NavBar';

export default function MainInterface() {
  return (
    <div style={pageWrapper}>
      <NavBar />

      <main style={mainWrapper}>
        {/* 3-Column Layout */}
        <div style={gridWrapper}>
          {/* LEFT SIDEBAR — Profile Card */}
          <aside style={profileCard}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '4px solid black',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 60,
              }}
            >
              👤
            </div>

            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18 }}>
              Ryan Panucci
            </div>
            <div style={{ textAlign: 'center', fontSize: 14 }}>Participant</div>

            <hr style={{ margin: '14px 0' }} />

            <div style={profileStatRow}>
              <span>Profile Viewers</span>
              <span>8</span>
            </div>
            <div style={profileStatRow}>
              <span>Jobs Completed</span>
              <span>12</span>
            </div>
            <div style={profileStatRow}>
              <span>Connections</span>
              <span>6</span>
            </div>
            <div style={profileStatRow}>
              <span>Reviews</span>
              <span>2</span>
            </div>
          </aside>

          {/* CENTER FEED */}
          <section>
            <button style={createPostBtn}>＋ Create Post</button>

            <div style={{ marginTop: 24 }}>
              <article style={postCard}>
                <header
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      border: '3px solid black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>User2</div>
                    <div style={{ fontSize: 12, color: '#555' }}>
                      2 Connections • 2h ago
                    </div>
                  </div>
                </header>

                <div style={{ marginBottom: 12, fontWeight: 600 }}>
                  Post Description
                </div>

                <div style={imagePlaceholder}>🖼</div>

                <footer
                  style={{
                    display: 'flex',
                    gap: 24,
                    marginTop: 12,
                    fontSize: 14,
                  }}
                >
                  <span style={{ cursor: 'pointer' }}>👍 Like</span>
                  <span style={{ cursor: 'pointer' }}>💬 Comment</span>
                </footer>
              </article>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={alertBox}>
              <div>Important: Appointment</div>
              <div style={{ fontWeight: 400, marginTop: 4 }}>
                Tomorrow: 9:00am - 10:00am &gt;
              </div>
            </div>

            <div style={alertBox}>
              <div>Important: Pending Request</div>
              <div style={{ fontWeight: 400, marginTop: 4 }}>Meeting Request &gt;</div>
            </div>

            <div style={quickActions}>
              <div
                style={{
                  fontWeight: 700,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Quick Actions
              </div>
              <a style={quickActionLink}>Post a Job &gt;</a>
              <a style={quickActionLink}>Manage Job Posts &gt;</a>
              <a style={quickActionLink}>Find a Support Provider &gt;</a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* --- STYLES --- */

const pageWrapper: CSSProperties = {
  minHeight: '100vh',
  background: '#ffffff',
};

const mainWrapper: CSSProperties = {
  padding: '30px 40px',
};

const gridWrapper: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
  gap: '40px',
};

const profileCard: CSSProperties = {
  border: '2px solid black',
  borderRadius: '18px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
};

const profileStatRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  padding: '3px 0',
};

const createPostBtn: CSSProperties = {
  background: 'white',
  border: '2px solid black',
  borderRadius: '25px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontWeight: 600,
};

const postCard: CSSProperties = {
  border: '2px solid black',
  borderRadius: '18px',
  padding: '18px',
  background: '#F2FAFF',
};

const imagePlaceholder: CSSProperties = {
  border: '2px solid black',
  borderRadius: '12px',
  height: '250px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '70px',
};

const alertBox: CSSProperties = {
  background: '#F7BCBC',
  border: '2px solid black',
  borderRadius: '20px',
  padding: '16px',
  fontWeight: 600,
  textAlign: 'center',
};

const quickActions: CSSProperties = {
  border: '2px solid black',
  borderRadius: '20px',
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
};

const quickActionLink: CSSProperties = {
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px 0',
  color: 'inherit',
  textDecoration: 'none',
};
