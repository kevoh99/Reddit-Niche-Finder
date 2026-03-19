// src/components/SavedDrawer.jsx
import { oppScore, tier } from "../hooks/useNiches";

export default function SavedDrawer({ saved, compareList, onRemove, onCompare, onLaunchCompare, onClose }) {
  const exportCSV = () => {
    const hdr = ["Name","Subreddit","Opp Score","Trend","Competition","Monetization","Growth","Viability","Website Idea","Monetization Methods"];
    const rows = saved.map(n => [
      `"${n.name}"`, `"r/${n.subreddit}"`, oppScore(n),
      n.trend_score, n.competition_score, n.monetization_score,
      n.growth_score, n.viability_score,
      `"${(n.website_idea || "").replace(/"/g, "'")}"`,
      `"${(n.monetization_methods || []).join(", ")}"`,
    ]);
    const csv = [hdr, ...rows].map(r => r.join(",")).join("\n");
    dl(new Blob([csv], { type: "text/csv" }), `niches-${Date.now()}.csv`);
  };

  const exportJSON = () => {
    dl(new Blob([JSON.stringify(saved, null, 2)], { type: "application/json" }), `niches-${Date.now()}.json`);
  };

  const dl = (blob, name) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 340,
      background: "var(--bg-2)", borderLeft: "1px solid var(--border)",
      zIndex: 90, display: "flex", flexDirection: "column",
      animation: "slideIn .25s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "17px 18px", borderBottom: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.14em", marginBottom: 3 }}>
            SAVED NICHES
          </div>
          <h3 style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            {saved.length} saved
          </h3>
        </div>
        <button onClick={onClose} style={{
          background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)",
          borderRadius: 7, padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: "var(--mono)",
        }}>✕</button>
      </div>

      {/* Export */}
      <div style={{
        padding: "11px 18px", borderBottom: "1px solid var(--border)",
        display: "flex", gap: 7, flexShrink: 0,
      }}>
        {[
          { label: "↓ CSV",  fn: exportCSV, color: "#4ade80" },
          { label: "↓ JSON", fn: exportJSON, color: "#60a5fa" },
        ].map(({ label, fn, color }) => (
          <button key={label} onClick={fn} disabled={!saved.length}
            style={{
              flex: 1, background: saved.length ? `${color}14` : "var(--bg-card)",
              color: saved.length ? color : "var(--text-dim)",
              border: `1px solid ${saved.length ? color + "33" : "var(--border)"}`,
              borderRadius: 7, padding: "8px", fontSize: 10, letterSpacing: "0.07em",
              cursor: saved.length ? "pointer" : "not-allowed", fontFamily: "var(--mono)",
              transition: "all .15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "11px 18px" }}>
        {saved.length === 0 && (
          <div style={{
            textAlign: "center", padding: "44px 0",
            fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", lineHeight: 2.2,
          }}>
            Star any niche card<br />to save it here.
          </div>
        )}
        {saved.map(n => {
          const s    = oppScore(n);
          const t    = tier(s);
          const inCmp = compareList.some(c => c.name === n.name);
          return (
            <div key={n.name} style={{
              background: "var(--bg-card)", borderLeft: `3px solid ${t.color}`,
              border: "1px solid var(--border)", borderRadius: 9,
              padding: "11px 13px", marginBottom: 7,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                <div>
                  <div style={{ fontFamily: "var(--display)", fontSize: 13, fontWeight: 600, color: "var(--text-2)", lineHeight: 1.3 }}>
                    {n.name}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)", marginTop: 2 }}>
                    r/{n.subreddit}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 800, color: t.color }}>
                  {s}
                </span>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => onCompare(n)}
                  style={{
                    fontSize: 9, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.06em",
                    background: inCmp ? "#60a5fa14" : "var(--bg-deep)",
                    color: inCmp ? "#60a5fa" : "var(--text-dim)",
                    border: `1px solid ${inCmp ? "#60a5fa33" : "var(--border)"}`,
                    cursor: "pointer", fontFamily: "var(--mono)", transition: "all .15s",
                  }}
                >
                  {inCmp ? "✓ COMPARING" : "+ COMPARE"}
                </button>
                <button onClick={() => onRemove(n.name)}
                  style={{
                    fontSize: 9, padding: "3px 8px", borderRadius: 6,
                    background: "var(--bg-deep)", color: "#f8717177",
                    border: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--mono)",
                  }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch compare CTA */}
      {compareList.length >= 2 && (
        <div style={{ padding: "11px 18px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <button onClick={onLaunchCompare}
            style={{
              width: "100%", background: "linear-gradient(135deg, #60a5fa, #818cf8)",
              color: "#fff", borderRadius: 9, padding: 11, fontSize: 11,
              fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              border: "none", fontFamily: "var(--mono)", transition: "opacity .15s",
            }}
            onMouseEnter={e => e.target.style.opacity = ".85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            ⇄ COMPARE {compareList.length} NICHES
          </button>
        </div>
      )}
    </div>
  );
}
