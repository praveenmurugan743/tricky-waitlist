"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsolationPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("recordId")) router.replace("/");
    setUserName(sessionStorage.getItem("userName") || "");
  }, [router]);

  const shareText = `I just took the interior design quiz by Tricky Waitlist! Can you ace it? Try here: ${
    typeof window !== "undefined" ? window.location.origin : ""
  }`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Tricky Waitlist Design Quiz",
        text: shareText,
        url: window.location.origin,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0b09] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center space-y-6">
        <div>
          <p className="text-[#C8A96E] text-xs tracking-[0.4em] uppercase mb-1">
            Tricky Waitlist
          </p>
          <h1 className="text-white text-2xl font-bold">
            {userName ? `Nice try, ${userName.split(" ")[0]}!` : "Nice try!"}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Not all heroes win on the first try. Good luck next time!
          </p>
        </div>

        {/* Consolation prize */}
        <div className="border border-[#C8A96E]/30 bg-[#1a0f00] rounded-2xl p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
            Consolation prize
          </p>
          <h2 className="text-2xl font-bold text-[#C8A96E] mb-2">5% Off</h2>
          <p className="text-white/60 text-sm">
            5% off on any Tricky Waitlist purchase above ₹2,500.
            <br />
            We'll send the code to your email.
          </p>
        </div>

        {/* Share challenge */}
        <div className="space-y-3">
          <p className="text-white/30 text-xs">
            Think your friends can do better?
          </p>
          <button
            onClick={handleShare}
            className="w-full border border-[#C8A96E]/40 text-[#C8A96E] font-semibold py-3 rounded-xl hover:bg-[#C8A96E]/10 transition text-sm tracking-wide"
          >
            {copied ? "✓ Copied!" : "Challenge a Friend →"}
          </button>
        </div>
      </div>
    </main>
  );
}
