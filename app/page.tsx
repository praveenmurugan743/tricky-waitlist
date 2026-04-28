"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (res.status === 409) {
        sessionStorage.setItem("recordId", data.recordId);
        sessionStorage.setItem("userName", data.name);
        if (data.status === "take_quiz" || data.status?.startsWith("mcq"))
          router.push("/quiz");
        else if (data.status === "passed_pending") router.push("/spin");
        else if (data.status === "passed_completed") router.push("/spin");
        else if (data.status === "passed") router.push("/result");
        else if (data.status === "failed") router.push("/consolation");
        return;
      }

      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("recordId", data.recordId);
      sessionStorage.setItem("userName", name);
      router.push("/quiz");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0b09] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-white/25 text-xs tracking-wide mb-3">
            This feature will be available soon...
          </p>
          <p className="text-[#C8A96E] text-xs tracking-[0.4em] uppercase mb-1">
            Tricky Waitlist
          </p>
          <h1 className="text-white text-3xl font-bold leading-tight">
            Win rewards while you
            <br />
            wait for your <span className="text-[#C8A96E]">dream home.</span>
          </h1>
          <p className="text-white/40 text-sm mt-3 leading-relaxed">
            Answer 3 interior design questions correctly
            <br />
            and spin to win prizes worth up to ₹500.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["₹500 Cash", "Amazon Prime", "15% Off", "₹100 Voucher"].map((p) => (
            <span
              key={p}
              className="text-[#C8A96E] border border-[#C8A96E]/30 text-xs px-3 py-1 rounded-full bg-[#C8A96E]/5"
            >
              {p}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#C8A96E] transition text-sm"
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#C8A96E] transition text-sm"
          />
          {error && <p className="text-red-400 text-xs px-1">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8A96E] text-[#0d0b09] font-bold py-3 rounded-xl hover:bg-[#d4b97e] active:scale-[0.98] transition-all disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? "Saving..." : "Take the Quiz →"}
          </button>
        </form>
      </div>
    </main>
  );
}
