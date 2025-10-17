// app/page.tsx or pages/index.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-gray-900 text-white dark:bg-gray-950 border-b dark:border-gray-700 px-4 py-3 shadow-lg flex items-center justify-between">
      <div className="font-bold text-xl tracking-wide">Agent Web</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-indigo-400 transition">Home</a>
        <a href="#" className="hover:text-indigo-400 transition">Features</a>
        <a href="#" className="hover:text-indigo-400 transition">Docs</a>
        <a href="#" className="hover:text-indigo-400 transition">Contact</a>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-4 p-2 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        )}
      </div>
    </nav>
  );
};

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error fetching agent response:", error);
      setResponse("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 dark:bg-black transition-colors duration-500 text-gray-100">
      <Navbar />
      <section className="max-w-3xl mx-auto p-8 mt-12 rounded-lg bg-gray-900 dark:bg-gray-900 shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-indigo-400">Agent Chat</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query"
            className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-gray-500"
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-md">
            <h2 className="text-2xl font-bold mb-2 text-indigo-400">Agent Response</h2>
            <p>{response}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
