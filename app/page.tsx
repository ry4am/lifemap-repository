'use client';

import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import React from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

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
      <NavBar />

      {/* Login status helper */}
      <div
        style={{
          marginTop: "8px",
          marginLeft: "20px",
          fontSize: "12px",
          opacity: 0.7,
        }}
      >
        {status === "authenticated" && (
          <span>
            Signed in as <strong>{session?.user?.name}</strong> (
            {session?.user?.email})
          </span>
        )}
      </div>

      {/* PAGE LAYOUT */}
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "12px",
          padding: "0 20px",
          gap: "24px",
        }}
      >
        {/* LEFT SIDEBAR — NOW NARROWER */}
        <aside
          style={{
            width: "200px",              // ← was 260px
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            border: "2px solid black",
            minHeight: "350px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {/* Avatar */}
            <div
              style={{
                width: "80px",            // ← smaller
                height: "80px",
                borderRadius: "50%",
                background: "#d3d3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                fontSize: "32px",        // ← smaller
                color: "#4b4b8f",
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            <h3 style={{ margin: "4px 0 4px" }}>{displayName}</h3>

            <p style={{ opacity: 0.7, fontSize: "13px" }}>Participant</p>

            <div
              style={{
                marginTop: "16px",
                textAlign: "left",
                lineHeight: "1.5",
                fontSize: "13px",
              }}
            >
              <div>Profile Viewers <strong>8</strong></div>
              <div>Jobs Completed <strong>12</strong></div>
              <div>Connections <strong>6</strong></div>
              <div>Reviews <strong>2</strong></div>
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
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

          {/* FEED POST #1 — Cleaning */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              border: "2px solid black",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
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
              Today I helped a participant re-allocate some core funding…
            </p>

            {/* SMALLER IMAGE */}
            <div
              style={{
                width: "100%",
                maxWidth: "600px",        // ← shrink max width
                margin: "0 auto",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1581579186989-9d1c1c5f5c96?auto=format&fit=crop&w=900&q=80"
                alt="cleaning surfaces"
                width={600}
                height={300}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>

          {/* FEED POST #2 */}
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
                  width: "40px",
                  height: "40px",
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
              Using my NDIS plan for community access has helped me…
            </p>

            {/* SMALLER IMAGE */}
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1521302080334-4bebac27605e?auto=format&fit=crop&w=900&q=80"
                alt="community access"
                width={600}
                height={300}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside
          style={{
            width: "260px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
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

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              border: "2px solid black",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>Quick Actions</h3>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
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
