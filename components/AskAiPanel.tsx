"use client";

import { useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AskAiPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "AI request failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const aiMessage: Message = {
        role: "assistant",
        content: data.reply || "",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      alert("Network error talking to AI");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger button – you can hide this if you already have a header button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          borderRadius: 999,
          padding: "8px 16px",
          border: "1px solid #0f172a",
          background: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Ask AI
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setOpen(false)}
        >
          {/* Dialog */}
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              maxHeight: "80vh",
              background: "#020617",
              color: "#e5e7eb",
              borderRadius: 18,
              border: "1px solid #1f2933",
              boxShadow: "0 24px 50px rgba(0,0,0,0.6)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Ask LifeMap AI</h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                  }}
                >
                  Ask questions about appointments, planning, or support.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#9ca3af",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                borderRadius: 12,
                border: "1px solid #1f2937",
                padding: 10,
                marginBottom: 10,
                background: "#020617",
              }}
            >
              {messages.length === 0 && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    textAlign: "center",
                    margin: "40px 0",
                  }}
                >
                  Example: &quot;Help me plan my week around my appointments.&quot;
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    textAlign: m.role === "user" ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 10px",
                      borderRadius: 12,
                      background:
                        m.role === "user" ? "#2563eb" : "rgba(15,23,42,0.9)",
                      border:
                        m.role === "user"
                          ? "1px solid #1d4ed8"
                          : "1px solid #1f2937",
                      color: "#e5e7eb",
                      maxWidth: "90%",
                      fontSize: "0.9rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: 4,
                  }}
                >
                  Thinking…
                </p>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid #374151",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  borderRadius: 999,
                  padding: "10px 16px",
                  border: "none",
                  background: "#6366f1",
                  color: "white",
                  fontWeight: 600,
                  cursor: loading ? "default" : "pointer",
                  opacity: loading || !input.trim() ? 0.6 : 1,
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
