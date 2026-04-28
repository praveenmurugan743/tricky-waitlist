"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    number: 1,
    question: "Which color scheme makes a small room appear larger?",
    options: [
      { id: "a", text: "Dark and bold colors" },
      { id: "b", text: "Light and neutral tones" },
      { id: "c", text: "Bright neon colors" },
      { id: "d", text: "Mixed patterns and textures" },
    ],
  },
  {
    number: 2,
    question: "What does the 60-30-10 rule in interior design refer to?",
    options: [
      { id: "a", text: "60% furniture, 30% decor, 10% lighting" },
      { id: "b", text: "60% dominant color, 30% secondary, 10% accent" },
      { id: "c", text: "60% walls, 30% floor, 10% ceiling" },
      { id: "d", text: "60% budget on sofa, 30% beds, 10% misc" },
    ],
  },
  {
    number: 3,
    question:
      "Which of the following is the most effective way to keep a TV unit looking clutter-free?",
    options: [
      { id: "a", text: "Add more open shelves for display" },
      { id: "b", text: "Use bold colors to draw attention away from clutter" },
      {
        id: "c",
        text: "Use closed cabinets with concealed wiring and minimal open shelves",
      },
      { id: "d", text: "Choose oversized cabinets for maximum storage" },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(false);
  const currQuestion = QUESTIONS[currentQuestionId];

  useEffect(() => {
    const recordId = sessionStorage.getItem("recordId");
    if (!recordId) {
      router.replace("/");
      return;
    }

    const fetchStatus = async () => {
      const res = await fetch(`/api/status?recordId=${recordId}`);
      const data = await res.json();
      if (data.status === "mcq_completed_1") setCurrentQuestionId(1);
      else if (data.status === "mcq_completed_2") setCurrentQuestionId(2);
    };

    fetchStatus();
  }, [router]);

  const handleAnswer = async (answerId: string) => {
    if (selected || loading) return;
    setSelected(answerId);
    setLoading(true);

    const recordId = sessionStorage.getItem("recordId");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId,
          questionNumber: currQuestion.number,
          answer: answerId,
        }),
      });
      const data = await res.json();

      if (!data.correct) {
        setFeedback("wrong");
        setTimeout(() => router.push("/consolation"), 1600);
        return;
      }

      setFeedback("correct");

      if (data.passed) {
        setTimeout(() => router.push("/spin"), 1200);
      } else {
        setTimeout(() => {
          setCurrentQuestionId((prev) => prev + 1);
          setSelected(null);
          setFeedback(null);
        }, 900);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0b09] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#C8A96E] text-xs tracking-[0.4em] uppercase mb-1">
            Tricky Waitlist
          </p>
          <p className="text-white/40 text-xs">Design Quiz</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {QUESTIONS.map((_, i) => (
            <div
              key={"progress-" + i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < currentQuestionId
                  ? "bg-[#C8A96E]"
                  : i === currentQuestionId
                    ? "bg-[#C8A96E]/50"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
          Question {currentQuestionId + 1} of 3
        </p>
        <h2 className="text-white text-lg font-semibold mb-6 leading-snug">
          {currQuestion.question}
        </h2>

        <div className="space-y-3">
          {currQuestion.options.map((opt) => {
            const isSelected = selected === opt.id;
            let borderClass =
              "border-white/10 bg-white/5 hover:border-[#C8A96E]/40";
            let textClass = "text-white";

            if (isSelected && feedback === "correct") {
              borderClass = "border-green-500 bg-green-500/10";
              textClass = "text-green-400";
            } else if (isSelected && feedback === "wrong") {
              borderClass = "border-red-500 bg-red-500/10";
              textClass = "text-red-400";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={!!selected}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${borderClass} ${textClass} disabled:cursor-default`}
              >
                <span className="text-[#C8A96E] font-semibold mr-3 text-xs uppercase">
                  {opt.id}.
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {feedback && (
          <p
            className={`mt-5 text-center text-sm font-medium ${
              feedback === "correct" ? "text-green-400" : "text-red-400"
            }`}
          >
            {feedback === "correct"
              ? "✓ Correct! Great eye for design."
              : "✗ Not quite. Better luck next time!"}
          </p>
        )}
      </div>
    </main>
  );
}
