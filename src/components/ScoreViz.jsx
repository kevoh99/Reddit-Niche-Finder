// src/components/ScoreViz.jsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { tier } from "../hooks/useNiches";

export function ScoreBar({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)",
        width: 68, flexShrink: 0, letterSpacing: "0.07em", textTransform: "uppercase",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 3, background: "var(--bg-deep)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`, background: color, borderRadius: 2,
          transition: "width 1.1s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </div>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color, width: 26, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export function RadarViz({ niche, oppScore }) {
  const t = tier(oppScore);
  const data = [
    { m: "Trend",    v: niche.trend_score },
    { m: "Low Comp", v: niche.competition_score },
    { m: "Monetize", v: niche.monetization_score },
    { m: "Growth",   v: niche.growth_score },
    { m: "Website",  v: niche.viability_score },
  ];
  return (
    <ResponsiveContainer width="100%" height={150}>
      <RadarChart data={data} outerRadius={54}>
        <PolarGrid stroke="var(--border-2)" />
        <PolarAngleAxis dataKey="m" tick={{
          fill: "var(--text-dim)", fontSize: 9, fontFamily: "var(--mono)",
        }} />
        <Radar dataKey="v" stroke={t.color} fill={t.color} fillOpacity={0.1} strokeWidth={1.5} />
        <Tooltip contentStyle={{
          background: "var(--bg-2)", border: `1px solid ${t.color}33`,
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-2)",
        }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
