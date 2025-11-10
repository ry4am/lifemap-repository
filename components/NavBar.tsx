'use client';

export default function NavBar() {
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

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#59C3FF",
      padding: "10px 24px",
      borderBottom: "2px solid black"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <a href="/" style={{ fontSize: "28px", fontWeight: 700, color: "inherit", textDecoration: "none" }}>
          ❤️ LifeMap
        </a>
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
        <a href="/" style={navLink}>Home</a>
        <a href="/notifications" style={navLink}>Notifications</a>
        <a href="/calendar" style={navLink}>Calendar</a>
        <a href="#" style={{ fontSize: "28px", textDecoration: "none", color: "inherit" }}>⋯</a>
      </nav>
    </header>
  );
}
