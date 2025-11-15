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

  const askAiButton: React.CSSProperties = {
    padding: "6px 18px",
    borderRadius: "999px",
    border: "2px solid black",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
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
          <button
            type="button"
            style={askAiButton}
            onClick={() => setShowAskAi(true)}
          >
            Ask AI
          </button>
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

      {showAskAi && <AskAiPanel onClose={() => setShowAskAi(false)} />}
    </>
  );
}
