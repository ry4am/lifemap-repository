'use client';

import React, { type CSSProperties } from "react";
import NavBar from "@/components/NavBar";

type Post = {
  id: number;
  authorName: string;
  authorRole: string;
  timeAgo: string;
  avatarUrl: string;
  title: string;
  body: string;
  imageUrl?: string;
  tag?: string;
  likes: number;
  comments: number;
};

const posts: Post[] = [
  {
    id: 1,
    authorName: "Jordan S.",
    authorRole: "Support Coordinator",
    timeAgo: "1h ago",
    avatarUrl: "https://i.pravatar.cc/80?img=32",
    title: "Using NDIS Core Supports for domestic assistance",
    body:
      "Today I helped a participant re-allocate some core funding to include regular cleaning and laundry support. " +
      "If you’re feeling overwhelmed at home, talk to your provider or coordinator about how core supports can flex to your needs.",
    imageUrl:
      "https://images.pexels.com/photos/4239142/pexels-photo-4239142.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "NDIS Tip",
    likes: 18,
    comments: 5,
  },
  {
    id: 2,
    authorName: "Amelia R.",
    authorRole: "Participant",
    timeAgo: "3h ago",
    avatarUrl: "https://i.pravatar.cc/80?img=47",
    title: "How community access changed my week",
    body:
      "Using my NDIS plan for community access has helped me get back into my art class and meet new people. " +
      "Even one supported outing per week made a big difference to my confidence and routine.",
    imageUrl:
      "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Success Story",
    likes: 32,
    comments: 9,
  },
  {
    id: 3,
    authorName: "LifeMap Team",
    authorRole: "Platform Update",
    timeAgo: "Today",
    avatarUrl: "https://i.pravatar.cc/80?img=5",
    title: "Reminder: Transport funding & medical appointments",
    body:
      "Transport funding can often be used to get to your essential medical appointments and therapy sessions. " +
      "Check your plan details or ask your support coordinator to make sure you’re using this budget fully.",
    imageUrl:
      "https://images.pexels.com/photos/7578801/pexels-photo-7578801.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "NDIS Reminder",
    likes: 21,
    comments: 3,
  },
  {
    id: 4,
    authorName: "Sam K.",
    authorRole: "Support Worker",
    timeAgo: "Yesterday",
    avatarUrl: "https://i.pravatar.cc/80?img=12",
    title: "Preparing for a planning meeting",
    body:
      "Before your NDIS planning meeting, write down what a ‘good week’ looks like: appointments, social time, rest, " +
      "and what support you need for each. Bringing that picture to your meeting can help get the right supports funded.",
    tag: "Planning Advice",
    likes: 14,
    comments: 4,
  },
];

export default function MainInterface() {
  return (
    <div style={pageWrapper}>
      <NavBar />

      <main style={mainWrapper}>
        <div style={gridWrapper}>
          {/* LEFT SIDEBAR — Profile Card */}
          <aside style={profileCard}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "4px solid black",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 60,
              }}
            >
              👤
            </div>

            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>
              Ryan Panucci
            </div>
            <div style={{ textAlign: "center", fontSize: 14 }}>Participant</div>

            <hr style={{ margin: "14px 0" }} />

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
          <section style={{ minWidth: 0 }}>
            {/* Create post bar */}
            <div style={createPostBar}>
              <span style={{ fontWeight: 600 }}>Create a post</span>
              <button style={createPostBtn}>＋ Create Post</button>
            </div>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              {posts.map((post) => (
                <article key={post.id} style={postCard}>
                  {/* Header */}
                  <header
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={post.avatarUrl}
                        alt={post.authorName}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          border: "3px solid black",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{post.authorName}</div>
                        <div style={{ fontSize: 12, color: "#555" }}>
                          {post.authorRole} • {post.timeAgo}
                        </div>
                      </div>
                    </div>

                    {post.tag && (
                      <span style={tagBadge}>{post.tag}</span>
                    )}
                  </header>

                  {/* Text */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{post.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.5, color: "#333" }}>
                      {post.body}
                    </div>
                  </div>

                  {/* Image (optional) */}
                  {post.imageUrl && (
                    <div style={imageWrapper}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{
                          width: "100%",
                          maxHeight: 260,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  )}

                  {/* Footer actions */}
                  <footer style={postFooter}>
                    <div style={{ display: "flex", gap: 20 }}>
                      <button style={postActionBtn}>
                        👍 Like ({post.likes})
                      </button>
                      <button style={postActionBtn}>
                        💬 Comment ({post.comments})
                      </button>
                    </div>
                    <button style={postActionBtn}>💾 Save</button>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={alertBox}>
              <div style={{ fontWeight: 700 }}>Important: Appointment</div>
              <div style={{ fontWeight: 400, marginTop: 4 }}>
                Tomorrow: 9:00am - 10:00am &gt;
              </div>
            </div>

            <div style={alertBoxSecondary}>
              <div style={{ fontWeight: 700 }}>Important: Pending Request</div>
              <div style={{ fontWeight: 400, marginTop: 4 }}>
                Transport Support – awaiting confirmation &gt;
              </div>
            </div>

            <div style={quickActions}>
              <div
                style={{
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: 8,
                  fontSize: 14,
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
  minHeight: "100vh",
  background: "#f5f7fb",
};

const mainWrapper: CSSProperties = {
  padding: "24px 40px 40px",
};

const gridWrapper: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "280px minmax(0, 1fr) 280px",
  gap: "24px",
};

const profileCard: CSSProperties = {
  border: "2px solid black",
  borderRadius: "18px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  background: "#ffffff",
  boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
};

const profileStatRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  padding: "3px 0",
};

const createPostBar: CSSProperties = {
  background: "#ffffff",
  borderRadius: 18,
  border: "2px solid black",
  padding: "10px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
};

const createPostBtn: CSSProperties = {
  background: "#63C7FF",
  border: "2px solid black",
  borderRadius: "25px",
  padding: "8px 18px",
  cursor: "pointer",
  fontWeight: 600,
};

const postCard: CSSProperties = {
  border: "2px solid black",
  borderRadius: "18px",
  padding: "16px 16px 10px",
  background: "#F2FAFF",
  boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
};

const imageWrapper: CSSProperties = {
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  padding: 4,
  background: "#ffffff",
  marginTop: 4,
};

const postFooter: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  fontSize: 13,
};

const postActionBtn: CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
};

const tagBadge: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  padding: "4px 10px",
  borderRadius: "999px",
  border: "1px solid #111827",
  background: "#fef3c7",
};

const alertBox: CSSProperties = {
  background: "#F7BCBC",
  border: "2px solid black",
  borderRadius: "20px",
  padding: "16px",
  fontWeight: 600,
  textAlign: "center",
  boxShadow: "0 6px 16px rgba(248,113,113,0.35)",
};

const alertBoxSecondary: CSSProperties = {
  background: "#FCD34D",
  border: "2px solid black",
  borderRadius: "20px",
  padding: "16px",
  fontWeight: 600,
  textAlign: "center",
  boxShadow: "0 6px 16px rgba(251,191,36,0.35)",
};

const quickActions: CSSProperties = {
  border: "2px solid black",
  borderRadius: "20px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  background: "#ffffff",
  boxShadow: "0 6px 16px rgba(15,23,42,0.15)",
};

const quickActionLink: CSSProperties = {
  cursor: "pointer",
  fontSize: "14px",
  padding: "4px 0",
  color: "inherit",
  textDecoration: "none",
};
