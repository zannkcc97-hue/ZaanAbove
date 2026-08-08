"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatClient({ username }: { username: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Terjadi kesalahan." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Koneksi gagal, coba lagi." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
  }

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-search">Cari konten chat...</div>

        {messages.length === 0 ? (
          <div className="sidebar-empty">
            <h3>Belum ada obrolan</h3>
            <p>Percakapan Anda dengan Zaan Above akan ditampilkan di sini.</p>
            <button className="new-chat-btn" onClick={handleNewChat}>
              Obrolan baru
            </button>
          </div>
        ) : (
          <div className="sidebar-empty">
            <button className="new-chat-btn" onClick={handleNewChat}>
              Obrolan baru
            </button>
          </div>
        )}

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-username">{username}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </aside>

      <main className="main">
        {messages.length === 0 ? (
          <div className="main-empty">
            <div className="main-logo">
              <span className="main-logo-dot" />
              Zaan Above
            </div>
            <div className="main-hint">Tanyakan apa saja, saya siap membantu.</div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role}`}>
                <div className={`msg-bubble ${m.role}`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="msg-row assistant">
                <div className="typing-dim">Zaan Above sedang mengetik...</div>
              </div>
            )}
          </div>
        )}

        <div className="composer">
          <div className="composer-box">
            <textarea
              ref={textareaRef}
              className="composer-textarea"
              rows={1}
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="composer-row">
              <button className="send-btn" onClick={handleSend} disabled={loading}>
                Kirim
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
