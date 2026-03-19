// src/components/CompareModal.jsx
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { oppScore, tier } from "../hooks/useNiches";

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#c084fc", "#fb923c"];

const METRICS = [
  { key: "trend_score",        label: "Trend Momentum"   },
  { key: "competition_score",  label: "Low Competition"  },
  { key: "monetization_score", label: "Monetization"     },
  { key: "growth_score",       label: "Growth Rate"      },
  { key: "viability_score",    label: "Website Viability"},
];

export default function CompareModal({ niches, onClose }) {
  const radarLabels = ["Trend", "Low Comp", "Monetize", "Growth", "Website"];
  const radarData = radarLabels.map((m, i) => ({
    m,
    ...Object.fromEntries(niches.map(n => [n.name, [
      n.trend_score, n.competition_score, n.monetization_score,
      n.growth_score, n.viability_score,
    ][i]])),
  }));

  const ranked = [...niches].sort((a, b) => oppScore(b) - oppScore(a));

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#05080fcc",
        backdropFilter: "blur(10px)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--bg-2)", border: "1px solid var(--border-2)",
        borderRadius: 16, width: "100%", maxWidth: 900,
        maxHeight: "90vh", overflow: "auto",
        animation: "fadeUp .3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "var(--bg-2)", zIndex: 1,
        }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 3 }}>
              HEAD-TO-HEAD ANALYSIS
            </div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
              Niche Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border-2)", color: "var(--text-muted)",
              borderRadius: 8, padding: "6px 13px", fontSize: 11, cursor: "pointer", fontFamily: "var(--mono)",
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        <div style={{ padding: 22 }}>
          {/* Radar overlay */}
          <div style={{ background: "var(--bg-deep)", borderRadius: 12, padding: "16px 16px 10px", marginBottom: 22 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 12 }}>
              RADAR OVERLAY
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius={80}>
                <PolarGrid stroke="var(--border-2)" />
                <PolarAngleAxis dataKey="m" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--mono)" }} />
                {niches.map((n, i) => (
                  <Radar
                    key={n.name} name={n.name} dataKey={n.name}
                    stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.07} strokeWidth={2}
                  />
                ))}
                <Tooltip contentStyle={{
                  background: "var(--bg-2)", border: "1px solid var(--border-2)",
                  fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-2)",
                }} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginTop: 6 }}>
              {niches.map((n, i) => (
                <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i] }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>{n.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metric rows */}
          {METRICS.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.12em", marginBottom: 6 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {niches.map((n, i) => {
                  const val  = n[key];
                  const best = Math.max(...niches.map(x => x[key]));
                  const isB  = val === best;
                  return (
                    <div key={n.name} style={{
                      flex: 1, background: "var(--bg-deep)", borderRadius: 8, padding: "9px 11px",
                      border: `1px solid ${isB ? COLORS[i] + "55" : "var(--border)"}`,
                    }}>
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", marginBottom: 5,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {n.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ flex: 1, height: 3, background: "var(--bg-card)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${val}%`, background: COLORS[i], borderRadius: 2 }} />
                        </div>
                        <span style={{
                          fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
                          color: isB ? COLORS[i] : "var(--text-muted)",
                        }}>
                          {val}
                        </span>
                        {isB && <span style={{ fontSize: 10 }}>🏆</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Final scores */}
          <div style={{
            marginTop: 22, background: "var(--bg-deep)", borderRadius: 12,
            padding: 16, border: "1px solid var(--border)",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 14 }}>
              FINAL OPPORTUNITY SCORES
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {ranked.map((n, rank) => {
                const s  = oppScore(n);
                const t  = tier(s);
                const ci = niches.indexOf(n);
                return (
                  <div key={n.name} style={{
                    flex: 1, textAlign: "center", padding: "14px 8px", borderRadius: 10,
                    background: rank === 0 ? `${COLORS[ci]}10` : "var(--bg-2)",
                    border: `1px solid ${rank === 0 ? COLORS[ci] + "44" : "var(--border)"}`,
                  }}>
                    {rank === 0 && (
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: 8, color: COLORS[ci],
                        letterSpacing: "0.1em", marginBottom: 5,
                      }}>
                        TOP PICK
                      </div>
                    )}
                    <div style={{
                      fontFamily: "var(--display)", fontSize: 26, fontWeight: 800,
                      color: rank === 0 ? COLORS[ci] : "var(--text-muted)",
                    }}>
                      {s}
                    </div>
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)",
                      marginTop: 4, lineHeight: 1.5,
                    }}>
                      {n.name}
                    </div>
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: 8, color: t.color,
                      letterSpacing: "0.1em", marginTop: 3,
                    }}>
                      {t.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
