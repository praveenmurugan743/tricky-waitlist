"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [prize, setPrize] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const recordId = sessionStorage.getItem("recordId");
    if (!recordId) {
      router.replace("/");
      return;
    }

    fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "passed") {
          router.replace("/");
          return;
        }
        setPrize(data.prize);
        setUserName(data.name);
      });
  }, [router]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = prize
    ? `I just won ${prize.label} from Tricky Waitlist! 🎉 Take their interior design quiz and spin to win: ${origin}`
    : `Take their interior design quiz and spin to win: ${origin}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "I won at Tricky Waitlist!",
        text: shareText,
        url: window.location.origin,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!prize)
    return (
      <main className="min-h-screen bg-[#0d0b09] flex items-center justify-center">
        <p className="text-white/30 text-sm">Loading...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#0d0b09] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center space-y-6">
        <div>
          <p className="text-[#C8A96E] text-xs tracking-[0.4em] uppercase mb-1">
            Tricky Waitlist
          </p>
          <h1 className="text-white text-2xl font-bold">
            Congrats{userName ? `, ${userName.split(" ")[0]}` : ""}! 🎉
          </h1>
        </div>

        {/* Prize card */}
        <div
          className="border rounded-2xl p-6"
          style={{ borderColor: prize.color + "40", backgroundColor: prize.bg }}
        >
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
            Your prize
          </p>
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: prize.color }}
          >
            {prize.label}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {prize.description}
          </p>
        </div>

        {/* Redeem note */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs leading-relaxed">
            Our team will reach out to your registered email within 48 hours
            with redemption details.
          </p>
        </div>

        {/* Share */}
        <div className="space-y-3">
          <p className="text-white/30 text-xs">
            Know someone who loves great interiors?
          </p>
          <button
            onClick={handleShare}
            className="w-full border border-[#C8A96E]/40 text-[#C8A96E] font-semibold py-3 rounded-xl hover:bg-[#C8A96E]/10 transition text-sm tracking-wide"
          >
            {copied ? "✓ Copied to clipboard!" : "Share & Challenge Friends →"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-white/30 text-xs py-2 hover:text-white/50 transition"
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}
