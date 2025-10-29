'use client';

export default function MainInterface() {
  return (
    <main style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* Top Navigation Bar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#59C3FF",
        padding: "10px 24px",
        borderBottom: "2px solid black"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "28px", fontWeight: 700 }}>❤️ LifeMap</div>
        </div>

        <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <input
            placeholder="Search . . ."
            style={{
              width: "50%",
              padding: "10px 16px",
              borderRadius: "25px",
              border: "2px solid black",
              fontSize: "15px"
            }}
          />
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "24px", paddingRight: "20px" }}>
          <button style={navBtn}>Ask AI</button>
          <a href="#" style={navLink}>Home</a>
          <a href="#" style={navLink}>Notifications</a>
          <a href="#" style={navLink}>Calendar</a>
          <a href="#" style={{ fontSize: "28px", textDecoration: "none", color: "inherit" }}>⋯</a>
        </nav>
      </header>

      {/* 3-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "30px 40px", gap: "40px" }}>

        {/* LEFT SIDEBAR — Profile Card */}
        <aside style={profileCard}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "80px" }}>👤</div>
            <div style={{ fontSize: "18px", fontWeight: 600 }}>Ryan Panucci</div>
            <div style={{ fontSize: "13px", opacity: 0.6 }}>Participant</div>
          </div>

          <hr />

          <div style={profileStatRow}><span>Profile Viewers</span><span>8</span></div>
          <div style={profileStatRow}><span>Jobs Completed</span><span>12</span></div>
          <div style={profileStatRow}><span>Connections</span><span>6</span></div>
          <div style={profileStatRow}><span>Reviews</span><span>2</span></div>
        </aside>

        {/* CENTER FEED */}
        <section style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <button style={createPostBtn}>＋ Create Post</button>

          {/* Example Post */}
          <article style={postCard}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "45px" }}>👤</div>
              <div>
                <div style={{ fontWeight: 600 }}>User2</div>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>2 Connections • 2h ago</div>
              </div>
            </div>

            <p style={{ margin: "12px 0 6px" }}>Post Description</p>

            <div style={imagePlaceholder}>🖼️</div>

            <div style={{ display: "flex", gap: "20px", paddingTop: "10px" }}>
              <span>👍 Like</span>
              <span>💬 Comment</span>
            </div>
          </article>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={alertBox}>
            Important: Appointment<br/>
            Tomorrow: 9:00am - 10:00am &gt;
          </div>
          <div style={alertBox}>
            Important: Pending Request<br/>
            Meeting Request &gt;
          </div>

          <div style={quickActions}>
            <div style={{ fontWeight: 600, marginBottom: "8px" }}>Quick Actions</div>
            <a href="#" style={quickActionLink}>Post a Job &gt;</a>
            <a href="#" style={quickActionLink}>Manage Job Posts &gt;</a>
            <a href="#" style={quickActionLink}>Find a Support Provider &gt;</a>
          </div>
        </aside>

      </div>
    </main>
  );
}

/* --- STYLES --- */

const navBtn: React.CSSProperties = {
  background: "white",
  border: "2px solid black",
  borderRadius: "18px",
  padding: "6px 14px",
  cursor: "pointer",
  fontWeight: 600
};

const navLink: React.CSSProperties = {
  cursor: "pointer",
  fontSize: "16px",
  color: "inherit",
  textDecoration: "none"
};

const profileCard: React.CSSProperties = {
  border: "2px solid black",
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const profileStatRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  padding: "3px 0"
};

const createPostBtn: React.CSSProperties = {
  background: "white",
  border: "2px solid black",
  borderRadius: "25px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: 600,
  width: "fit-content"
};

const postCard: React.CSSProperties = {
  border: "2px solid black",
  borderRadius: "18px",
  padding: "18px",
  background: "#F2FAFF"
};

const imagePlaceholder: React.CSSProperties = {
  border: "2px solid black",
  borderRadius: "12px",
  height: "250px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "70px"
};

const alertBox: React.CSSProperties = {
  background: "#F7BCBC",
  border: "2px solid black",
  borderRadius: "20px",
  padding: "16px",
  fontWeight: 600,
  textAlign: "center"
};

const quickActions: React.CSSProperties = {
  border: "2px solid black",
  borderRadius: "20px",
  padding: "18px",
  display: "flex",
  flexDirection: "column"
};

const quickActionLink: React.CSSProperties = {
  cursor: "pointer",
  fontSize: "14px",
  padding: "4px 0",
  color: "inherit",
  textDecoration: "none"
};
