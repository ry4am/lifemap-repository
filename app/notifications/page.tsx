'use client';

import NavBar from '@/components/NavBar';
import useSWR from 'swr';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  icon: 'settings' | 'calendar' | 'photo' | 'user-plus' | 'wrench';
  when: string; // e.g., 'Today 3:00pm'
  importance?: 'important' | 'upcoming';
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NotificationsPage() {
  const { data } = useSWR<{items: NotificationItem[]}>('/api/notifications', fetcher);

  return (
    <main style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <NavBar />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "30px 40px", gap: "40px" }}>

        {/* LEFT badges */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={pill("#F7BCBC")}>
            <strong>Important: Appointment</strong><br/>
            Tomorrow: 9:00am - 10:00am &gt;
          </div>
          <div style={pill("#F7BCBC")}>
            <strong>Important: Pending Request</strong><br/>
            Meeting Request &gt;
          </div>
          <div style={pill("#F3F2B2")}>
            <strong>Upcoming: Appointment</strong><br/>
            Next Friday: 9:00am - 10:00am &gt;
          </div>
        </aside>

        {/* CENTER notifications list */}
        <section>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "2px solid black", borderRadius: "8px", padding: "10px 14px",
            background: "#EFF6FB"
          }}>
            <h2 style={{ margin: 0 }}>Notifications</h2>
            <button style={{
              background: "#fff", border: "2px solid black", borderRadius: "10px",
              padding: "6px 10px", cursor: "pointer", fontWeight: 600
            }}>Filter ⎘</button>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0 0" }}>
            {(data?.items ?? demoItems).map((n) => (
              <li key={n.id} style={{ borderBottom: "2px solid #000", padding: "14px 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "28px", width: 36, textAlign: "center" }}>
                    {iconMap(n.icon)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontWeight: 700 }}>{n.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{n.when}</div>
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.8 }}>{n.description}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT profile + quick actions */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{
            border: "2px solid black", borderRadius: "20px", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <div style={{ fontSize: 36 }}>👤</div>
            <div>
              <div style={{ fontWeight: 700 }}>Ryan Panucci</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Participant</div>
            </div>
          </div>

          <div style={{
            border: "2px solid black", borderRadius: "20px", padding: "18px",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Quick Actions</div>
            <a href="#" style={qa}>Post a Job &gt;</a>
            <a href="#" style={qa}>Manage Job Posts &gt;</a>
            <a href="#" style={qa}>Find a Support Provider &gt;</a>
            <button
              onClick={sendTestEmail}
              style={{ marginTop: 10, ...btn }}
              title="Sends a demo email using /api/email/send"
            >
              Send Test Email
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
}

/* helpers */
const pill = (bg: string): React.CSSProperties => ({
  background: bg, border: "2px solid black", borderRadius: "20px",
  padding: "12px 16px", width: 320, fontWeight: 600
});
const qa: React.CSSProperties = { cursor: "pointer", color: "inherit", textDecoration: "none", padding: "4px 0" };
const btn: React.CSSProperties = { background: "#fff", border: "2px solid black", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontWeight: 600 };

function iconMap(k: NotificationItem['icon']) {
  switch (k) {
    case 'settings': return '⚙️';
    case 'calendar': return '🗓️';
    case 'photo': return '📷';
    case 'user-plus': return '➕👤';
    case 'wrench': return '🛠️';
  }
}

const demoItems: NotificationItem[] = [
  { id: '1', title: 'Update Profile Details', description: 'We have requested you to update profile settings.', icon: 'settings', when: 'Today 3:00pm' },
  { id: '2', title: 'Review Calendar Changes', description: 'Your calendar has been updated, check for changes.', icon: 'calendar', when: 'Today 1:40pm' },
  { id: '3', title: 'Profile Viewed', description: 'User3 has viewed your profile.', icon: 'photo', when: 'Today 12:35pm' },
  { id: '4', title: 'Network Request', description: 'User4 would like to connect with you.', icon: 'user-plus', when: 'Yesterday 4:10pm' },
  { id: '5', title: 'System Updates', description: 'We updated some systems, check socials for more.', icon: 'wrench', when: '14/06 11:30am' },
  { id: '6', title: 'Review Calendar Changes', description: 'Your calendar has been updated, check for changes.', icon: 'calendar', when: '14/06 11:10am' },
  { id: '7', title: 'Profile Viewed', description: 'User2 has viewed your profile.', icon: 'photo', when: '13/06 4:45pm' },
  { id: '8', title: 'Network Request', description: 'User2 would like to connect with you.', icon: 'user-plus', when: '13/06 1:30pm' },
];

async function sendTestEmail() {
  await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      to: 'your-email@example.com',
      subject: 'LifeMap Test Email',
      text: 'Hello from LifeMap!',
      html: '<strong>Hello from LifeMap!</strong>'
    })
  });
  alert('Sent (check your inbox)');
}
