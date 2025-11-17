'use client';

import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  // Use full name from Neon user table if logged in
  const displayName =
    status === "authenticated" && session?.user?.name
      ? session.user.name
      : "Participant";

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        width: "100%",
        background: "#f0f4ff",
      }}
    >
      {/* Top Navbar */}
      <NavBar />

      {/* Small login status helper (you can remove later if you want) */}
      <div
        style={{
          marginTop: "8px",
          marginLeft: "20px",
          fontSize: "12px",
          opacity: 0.7,
        }}
      >
        {status === "loading" && <span>Checking sign-in status…</span>}
        {status === "unauthenticated" && (
          <span>You are not signed in. (Home page sees no session.)</span>
        )}
        {status === "authenticated" && (
          <span>
            Signed in as <strong>{session?.user?.name}</strong> (
            {session?.user?.email})
          </span>
        )}
      </div>

      {/* Page Container */}
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "12px",
          padding: "0 20px",
          gap: "24px",
        }}
      >
        {/* Left Profile Sidebar */}
        <aside
          style={{
            width: "260px",
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "2px solid black",
            minHeight: "350px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {/* Avatar circle */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#d3d3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "42px",
                color: "#4b4b8f",
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Dynamic User Name */}
            <h2 style={{ margin: "4px 0 8px" }}>{displayName}</h2>

            <p style={{ opacity: 0.7 }}>Participant</p>

            {/* Stats */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                lineHeight: "1.9",
              }}
            >
              <div>
                Profile Viewers <strong>8</strong>
              </div>
              <div>
                Jobs Completed <strong>12</strong>
              </div>
              <div>
                Connections <strong>6</strong>
              </div>
              <div>
                Reviews <strong>2</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Create Post Box */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              border: "2px solid black",
            }}
          >
            <input
              type="text"
              placeholder="Create a post"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "2px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Example Feed Post #1 */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              border: "2px solid black",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#e5e7eb",
                }}
              ></div>
              <div>
                <strong>Jordan S.</strong>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>
                  Support Coordinator • 1h ago
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: "12px" }}>
              Using NDIS Core Supports for domestic assistance
            </h3>

            <p style={{ opacity: 0.8, marginBottom: "12px" }}>
              Today I helped a participant re-allocate some core funding to
              include regular cleaning and laundry support…
            </p>

            <div
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6950"
                alt="cleaning"
                width={800}
                height={400}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>

          {/* Example Feed Post #2 */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              border: "2px solid black",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#e5e7eb",
                }}
              ></div>
              <div>
                <strong>Amelia R.</strong>
                <div style={{ fontSize: "12px", opacity: 0.6 }}>
                  Participant • 3h ago
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: "12px" }}>
              How community access changed my week
            </h3>

            <p style={{ opacity: 0.8, marginBottom: "12px" }}>
              Using my NDIS plan for community access has helped me get back
              into my art class and meet new people…
            </p>

            <div
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d"
                alt="community access"
                width={800}
                height={400}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside
          style={{
            width: "260px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Appointment Card */}
          <div
            style={{
              background: "#ffd6d6",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid black",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Important: Appointment</h3>
            <p>Tomorrow: 9:00am - 10:00am</p>
          </div>

          {/* Pending Request Card */}
          <div
            style={{
              background: "#fff2b3",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid black",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Important: Pending Request</h3>
            <p>Transport Support – awaiting confirmation</p>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid black",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Quick Actions</h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                lineHeight: "1.8",
              }}
            >
              <li>Post a Job &gt;</li>
              <li>Manage Job Posts &gt;</li>
              <li>Find a Support Provider &gt;</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
