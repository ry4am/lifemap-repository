'use client';

import React, { useState } from "react";
import AskAiPanel from "./AskAiPanel";

export default function NavBar() {
  const [showAskAi, setShowAskAi] = useState(false);

  const navButton: React.CSSProperties = {
    cursor: "pointer",
    fontSize: "16px",
    color: "inherit",
    textDecoration: "none",
  };

  const chatBubbleButton: React.CSSProperties = {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    width: "80px",
    height: "80px",
    borderRadius: "999px",
    border: "2px solid black",
    background: "#FDE1E1", // light red
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px",
    boxShadow: "0 10px 22px rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          background: "#63C7FF",
          borderBottom: "2px solid black",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="/"
            style={{ fontSize: "24px", fontWeight: 700, color: "inherit", textDecoration: "none" }}
          >
            ❤️ LifeMap
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <input
            placeholder="Search . . ."
            style={{
              width: "60%",
              maxWidth: "480px",
              borderRadius: "999px",
              border: "2px solid black",
              padding: "8px 16px",
            }}
          />
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "24px", paddingRight: "20px" }}>
          <a href="/" style={navButton}>
            Home
          </a>
          <a href="/notifications" style={navButton}>
            Notifications
          </a>
          <a href="/calendar" style={navButton}>
            Calendar
          </a>
          <a href="/appointments" style={navButton}>
            Appointments
          </a>
        </nav>
      </header>

      <button
        type="button"
        style={chatBubbleButton}
        onClick={() => setShowAskAi(true)}
        aria-label="Open Ask AI"
      >
        Ask Ai
      </button>

      {showAskAi && <AskAiPanel onClose={() => setShowAskAi(false)} />}
    </>
  );
}
