// src/components/Loader.jsx
import { useState, useEffect } from "react";

const STEPS = [
  "Scanning subreddit velocity",
  "Analyzing trend momentum",
  "Estimating keyword competition",
  "Scoring monetization potential",
  "Evaluating website viability",
  "Ranking opportunities",
];

export default function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(p => (p + 1) % STEPS.length), 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "100px 0", gap: 20,
    }}>
      <div style={{ position: "relative", width: 68, height: 68 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: "absolute", inset: `${i * 11}px`, borderRadius: "50%",
            border: `1.5px solid #4ade80${["ff", "55", "1a"][i]}`,
            animation: `spin ${1 + i * 0.35}s linear infinite ${i % 2 ? "reverse" : ""}`,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#4ade80aa" }}>
        {STEPS[step]}…
      </div>
    </div>
  );
}
