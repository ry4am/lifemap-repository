'use client';

import React, { useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface AskAiPanelProps {
  onClose: () => void;
}

export default function AskAiPanel({ onClose }: AskAiPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input.trim() };
    const nextMessages = [...messages, newMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage.content,
          history: nextMessages, // send short history so replies feel contextual
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const reply: Message = {
        role: "assistant",
        content: data.reply || "I’m not sure how to respond to that.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong talking to the AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="askai-backdrop">
      <div className="askai-panel">
        <header className="askai-header">
          <div>
            <h2 className="askai-title">Ask AI</h2>
            <p className="askai-subtitle">
              Ask questions about your schedule, appointments, or NDIS support.
            </p>
          </div>
          <button className="askai-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="askai-messages">
          {messages.length === 0 && !error && (
            <p className="askai-placeholder">
              Try something like:
              <br />
              <span>• “What appointments do I have this week?”</span>
              <br />
              <span>• “How should I prepare for my medical visit?”</span>
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user" ? "msg msg-user" : "msg msg-assistant"
              }
            >
              <div className="msg-label">
                {m.role === "user" ? "You" : "LifeMap AI"}
              </div>
              <div className="msg-bubble">{m.content}</div>
            </div>
          ))}

          {error && <div className="askai-error">{error}</div>}

          {loading && (
            <div className="askai-loading">
              Thinking…
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="askai-form">
          <textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here…"
            className="askai-input"
          />
          <button type="submit" disabled={loading || !input.trim()} className="askai-button">
            {loading ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .askai-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          display: flex;
          justify-content: flex-end;
          z-index: 50;
        }

        .askai-panel {
          width: 420px;
          max-width: 100%;
          height: 100vh;
          background: #0f172a;
          border-left: 1px solid #1e293b;
          padding: 20px 20px 16px;
          box-shadow: -20px 0 40px rgba(0, 0, 0, 0.45);
          color: #e5e7eb;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .askai-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .askai-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .askai-subtitle {
          margin: 4px 0 0;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .askai-close {
          border: none;
          background: transparent;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 4px 8px;
          border-radius: 999px;
          transition: background 0.15s, color 0.15s;
        }

        .askai-close:hover {
          background: #1e293b;
          color: #e5e7eb;
        }

        .askai-messages {
          flex: 1;
          margin-top: 8px;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 12px;
          background: radial-gradient(
              circle at top left,
              rgba(56, 189, 248, 0.06),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom,
              rgba(129, 140, 248, 0.08),
              transparent 60%
            ),
            #020617;
          overflow-y: auto;
        }

        .askai-placeholder {
          font-size: 0.85rem;
          color: #9ca3af;
          line-height: 1.5;
        }

        .msg {
          margin-bottom: 10px;
        }

        .msg-label {
          font-size: 0.75rem;
          margin-bottom: 2px;
          color: #9ca3af;
        }

        .msg-bubble {
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-wrap;
        }

        .msg-user .msg-bubble {
          background: #2563eb;
          color: white;
          align-self: flex-end;
        }

        .msg-assistant .msg-bubble {
          background: #111827;
          border: 1px solid #1f2937;
        }

        .askai-error {
          margin-top: 8px;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.4);
          color: #fecaca;
        }

        .askai-loading {
          margin-top: 4px;
          font-size: 0.8rem;
          color: #c4b5fd;
        }

        .askai-form {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .askai-input {
          width: 100%;
          resize: none;
          border-radius: 10px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          padding: 8px 10px;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border 0.15s, box-shadow 0.15s;
        }

        .askai-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
        }

        .askai-button {
          align-self: flex-end;
          padding: 8px 16px;
          border-radius: 999px;
          border: none;
          background: #6366f1;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s, transform 0.05s;
        }

        .askai-button:hover:not(:disabled) {
          background: #4f46e5;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);
        }

        .askai-button:active:not(:disabled) {
          transform: translateY(1px);
        }

        .askai-button:disabled {
          background: #4b5563;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
