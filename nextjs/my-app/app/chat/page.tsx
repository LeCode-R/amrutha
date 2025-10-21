// app/chat/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = "http://localhost:9000"; // Change if needed

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----- Send chat message -----
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "ai", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: "Error connecting to AI backend." }]);
    } finally {
      setLoading(false);
    }
  };

  // ----- Upload paper and download ZIP -----
  const uploadPaper = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // MUST match backend parameter

      const res = await fetch(`${BACKEND_URL}/upload-paper`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate ZIP");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated_code.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Error generating code ZIP: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">AI Paper2Code Agent</h1>

      {/* Chat Box */}
      <div className="mb-6 p-4 bg-white rounded shadow h-[300px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded ${
                msg.from === "user" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500">AI is typing...</p>}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Chat Input */}
      <div className="flex mb-6">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          placeholder="Type your message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </div>

      {/* Paper Upload */}
      <div className="mb-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button
        onClick={uploadPaper}
        className="p-2 bg-green-500 text-white rounded"
        disabled={!file || loading}
      >
        Upload Paper & Download ZIP
      </button>
    </div>
  );
}
