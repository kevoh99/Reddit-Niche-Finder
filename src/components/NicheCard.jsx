// src/components/NicheCard.jsx
import { useState, useEffect } from "react";
import { oppScore, tier } from "../hooks/useNiches";
import { ScoreBar, RadarViz } from "./ScoreViz";

const ACCENT = ["#4ade80", "#60a5fa", "#fbbf24", "#c084fc", "#fb923c"];

export default function NicheCard({
  niche, rank, animDelay, isSaved, inCompare,
  onSave, onCompare, view,
}) {
  const [vis,     setVis]     = useState(false);
  const [copied,  setCopied]  = useState(false);
  const score = oppScore(niche);
  const t     = tier(score);

  useEffect(() => {
    const tm = setTimeout(() => setVis(true), animDelay);
    return () => clearTimeout(tm);
  }, [animDelay]);

  const copyIdea = () => {
    navigator.clipboard.writeText(niche.website_idea || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const cardStyle = {
    opacity:    vis ? 1 : 0,
    transform:  vis ? "translateY(0)" : "translateY(16px)",
    transition: `opacity .45s ease ${animDelay}ms, transform .45s ease ${animDelay}ms, border-color .2s, box-shadow .2s`,
    background: "linear-gradient(160deg, var(--bg-card), var(--bg-2))",
    border:     `1px solid ${inCompare ? t.color + "77" : "var(--border)"}`,
    borderRadius: 13,
    padding: 19,
    position: "relative",
    overflow: "hidden",
    cursor: "default",
    boxShadow: inCompare ? `0 0 0 2px ${t.color}33` : "none",
  };

  return (
    <div style={cardStyle}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = inCompare ? `0 10px 36px #00000055, 0 0 0 2px ${t.color}33` : "0 10px 36px #00000055"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = inCompare ? `0 0 0 2px ${t.color}33` : "none"; }}
    >
      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${t.color}, transparent 70%)`,
      }} />

      {/* Row 1: rank + tier + actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)" }}>
            #{String(rank).padStart(2, "0")}
          </span>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.11em",
            color: t.color, background: t.bg, padding: "2px 8px", borderRadius: 20,
          }}>
            {t.label}
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button
            onClick={() => onCompare(niche)}
            style={{
              fontSize: 9, padding: "3px 9px", borderRadius: 7, letterSpacing: "0.07em",
              background: inCompare ? "#60a5fa18" : "var(--bg-deep)",
              color: inCompare ? "#60a5fa" : "var(--text-dim)",
              border: `1px solid ${inCompare ? "#60a5fa44" : "var(--border)"}`,
              cursor: "pointer", fontFamily: "var(--mono)", transition: "all .15s",
            }}
          >
            {inCompare ? "✓ CMP" : "+ CMP"}
          </button>
          <button
            onClick={() => onSave(niche)}
            style={{
              fontSize: 15, padding: "1px 8px", borderRadius: 7, lineHeight: 1.5,
              background: isSaved ? "#fbbf2418" : "var(--bg-deep)",
              color: isSaved ? "#fbbf24" : "var(--text-dim)",
              border: `1px solid ${isSaved ? "#fbbf2444" : "var(--border)"}`,
              cursor: "pointer", fontFamily: "var(--mono)", transition: "all .15s",
            }}
          >
            {isSaved ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* Name + score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 11 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "var(--display)", fontSize: 14, fontWeight: 700,
            color: "var(--text)", lineHeight: 1.35, marginBottom: 2,
          }}>
            {niche.name}
          </h3>
          <a
            href={`https://reddit.com/r/${niche.subreddit}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)",
              textDecoration: "none", transition: "color .15s",
            }}
            onMouseEnter={e => e.target.style.color = t.color}
            onMouseLeave={e => e.target.style.color = "var(--text-dim)"}
          >
            r/{niche.subreddit} ↗
          </a>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 10 }}>
          <div style={{
            fontFamily: "var(--display)", fontSize: 28, fontWeight: 800,
            color: t.color, lineHeight: 1,
          }}>
            {score}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.1em" }}>
            OPP
          </div>
        </div>
      </div>

      {/* Score viz */}
      {view === "radar"
        ? <RadarViz niche={niche} oppScore={score} />
        : (
          <div style={{ marginBottom: 11 }}>
            <ScoreBar label="Trend"    value={niche.trend_score}        color="#4ade80" />
            <ScoreBar label="Low Comp" value={niche.competition_score}  color="#60a5fa" />
            <ScoreBar label="Monetize" value={niche.monetization_score} color="#fbbf24" />
            <ScoreBar label="Growth"   value={niche.growth_score}       color="#c084fc" />
            <ScoreBar label="Website"  value={niche.viability_score}    color="#fb923c" />
          </div>
        )
      }

      {/* Description */}
      <p style={{
        fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)", lineHeight: 1.8,
        borderLeft: `2px solid ${t.color}33`, paddingLeft: 9, margin: "11px 0",
      }}>
        {niche.description}
      </p>

      {/* Why now */}
      {niche.why_now && (
        <div style={{
          fontFamily: "var(--mono)", fontSize: 9, color: t.color + "bb",
          background: t.bg, borderRadius: 6, padding: "5px 9px", marginBottom: 10,
          letterSpacing: "0.02em",
        }}>
          ⚡ {niche.why_now}
        </div>
      )}

      {/* Website idea */}
      <div style={{ background: "var(--bg-deep)", borderRadius: 8, padding: "9px 11px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.13em" }}>
            💡 WEBSITE CONCEPT
          </div>
          <button
            onClick={copyIdea}
            style={{
              fontFamily: "var(--mono)", fontSize: 8, color: copied ? "#4ade80" : "var(--text-dim)",
              background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.06em",
              transition: "color .2s",
            }}
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-2)", lineHeight: 1.75 }}>
          {niche.website_idea}
        </div>
      </div>

      {/* Monetization tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {(niche.monetization_methods || []).map((m, i) => (
          <span key={i} style={{
            fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.05em",
            color: "#fbbf24", background: "#fbbf2410", padding: "3px 8px", borderRadius: 20,
          }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
