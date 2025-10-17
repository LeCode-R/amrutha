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

const HomePage = () => (
  <main className="min-h-screen bg-gray-950 dark:bg-black transition-colors duration-500 text-gray-100">
    <Navbar />
    <section className="max-w-3xl mx-auto p-8 mt-12 rounded-lg bg-gray-900 dark:bg-gray-900 shadow-md">
      <h1 className="text-4xl font-bold mb-4 text-indigo-400">Welcome to Agent Web</h1>
      <p className="text-gray-300">
        Instantly deploy and manage your AI agents. Experience elegant, modern UI with full dark mode support.
      </p>
      {/* Add additional agent-related components here */}
    </section>
  </main>
);

export default HomePage;
