"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PRIZES } from "@/lib/prizes";

// Wheel layout (4 equal segments, 90° each, clockwise from top):
// Segment 0 (0°–90°)   → Prize 3 (₹500 Cash)
// Segment 1 (90°–180°) → Prize 2 (₹100 Voucher)
// Segment 2 (180°–270°)→ Prize 1 (Amazon Prime)
// Segment 3 (270°–360°)→ Prize 0 (15% Off)
const SEGMENT_TO_PRIZE = [3, 2, 1, 0];
const PRIZE_TO_SEGMENT: Record<number, number> = {};
SEGMENT_TO_PRIZE.forEach((prizeId, seg) => {
  PRIZE_TO_SEGMENT[prizeId] = seg;
});

const SEG_COLORS = ["#C8A96E", "#1e1a14", "#8B6914", "#2a2318"];
const TEXT_COLORS = ["#0d0b09", "#C8A96E", "#0d0b09", "#C8A96E"];

function getTargetRotation(prizeIndex: number): number {
  const seg = PRIZE_TO_SEGMENT[prizeIndex];
  const segCenter = seg * 90 + 45;
  return 360 * 8 - segCenter; // 8 full spins minus offset
}

export default function SpinPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<(typeof PRIZES)[0] | null>(null);
  const [error, setError] = useState("");
  const hasSpun = useRef(false);

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
        if (data.status === "passed") router.replace("/result")
        if (data.status === "passed_completed" && data.prize) {
          setPrize(data.prize);
          hasSpun.current = true;
        }
      });

    drawWheel();
  }, [router]);

  function drawWheel() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = cx - 8;
    const WHEEL_LABELS = ["₹500", "₹100", "PRIME", "15% OFF"];
    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < 4; i++) {
      const start = -Math.PI / 2 + i * (Math.PI / 2);
      const end = start + Math.PI / 2;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = SEG_COLORS[i];
      ctx.fill();
      ctx.strokeStyle = "#0d0b09";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Prize label
      const mid = start + Math.PI / 4;
      const tx = cx + r * 0.62 * Math.cos(mid);
      const ty = cy + r * 0.62 * Math.sin(mid);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(mid + Math.PI / 2);
      ctx.fillStyle = TEXT_COLORS[i];
      ctx.font = `bold ${size < 260 ? 10 : 12}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(WHEEL_LABELS[i], 0, 0);
      ctx.restore();
    }

    // Center cap
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0b09";
    ctx.fill();
    ctx.strokeStyle = "#C8A96E";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#C8A96E";
    ctx.fill();
  }
  const handleClaim = async () => {
    const recordId = sessionStorage.getItem("recordId");
    await fetch("/api/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId, status: "passed" }),
    }).then((res) => console.log(res)).catch((err) => console.log(err));
    router.push("/result");
  };

  const handleSpin = async () => {
    if (spinning || prize || hasSpun.current) return;
    hasSpun.current = true;
    setSpinning(true);
    setError("");

    const recordId = sessionStorage.getItem("recordId");
    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const target = getTargetRotation(data.prizeIndex);
      setRotation(target);

      setTimeout(() => {
        setPrize(data.prize);
        setSpinning(false);
      }, 5200);
    } catch (err: any) {
      setError(err.message);
      setSpinning(false);
      hasSpun.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0b09] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center">
        <p className="text-[#C8A96E] text-xs tracking-[0.4em] uppercase mb-1">
          Tricky waitlist
        </p>
        <h1 className="text-white text-2xl font-bold mb-1">Spin to Win!</h1>
        <p className="text-white/40 text-sm mb-8">
          You aced all 3 questions. Your prize awaits.
        </p>

        {/* Pointer */}
        <div className="relative flex justify-center mb-1">
          <div
            className="w-0 h-0 z-10"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "22px solid #C8A96E",
            }}
          />
        </div>

        {/* Wheel */}
        <div className="flex justify-center mb-8">
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 5s cubic-bezier(0.15, 0.85, 0.25, 1)"
                : "none",
              willChange: "transform",
            }}
          >
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full shadow-2xl shadow-[#C8A96E]/10"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {!prize ? (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="bg-[#C8A96E] text-[#0d0b09] font-bold px-10 py-3 rounded-full hover:bg-[#d4b97e] active:scale-95 transition-all disabled:opacity-50 tracking-wide text-sm"
          >
            {spinning ? "Spinning…" : "SPIN NOW"}
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className="border rounded-2xl p-5 text-center"
              style={{
                borderColor: prize.color + "50",
                backgroundColor: prize.bg,
              }}
            >
              <p className="text-white/50 text-xs mb-1 uppercase tracking-widest">
                🎉 You won!
              </p>
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: prize.color }}
              >
                {prize.label}
              </h2>
              <p className="text-white/60 text-sm">{prize.description}</p>
            </div>
            <button
              onClick={handleClaim}
              className="w-full bg-[#C8A96E] text-[#0d0b09] font-bold py-3 rounded-xl hover:bg-[#d4b97e] transition text-sm tracking-wide"
            >
              Claim My Prize →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
