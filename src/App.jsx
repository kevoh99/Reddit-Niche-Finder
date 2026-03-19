// src/App.jsx
import { useState } from "react";
import { useNiches, oppScore } from "./hooks/useNiches";
import NicheCard      from "./components/NicheCard";
import CompareModal   from "./components/CompareModal";
import SavedDrawer    from "./components/SavedDrawer";
import ScanHistory    from "./components/ScanHistory";
import Loader         from "./components/Loader";

const CATEGORIES = [
  "All Categories", "Health & Fitness", "Personal Finance", "Technology",
  "Hobbies & Crafts", "Parenting", "Pets", "Food & Cooking",
  "Travel", "Gaming", "Self-Improvement", "Home & Garden",
  "AI Tools", "Sustainability", "Creator Economy",
];

const SORT_OPTIONS = ["overall", "trend", "competition", "monetization", "growth"];
const TIER_OPTIONS = ["all", "prime", "strong", "solid", "weak"];

const SORT_KEY = {
  overall:      n => -oppScore(n),
  trend:        n => -n.trend_score,
  competition:  n => -n.competition_score,
  monetization: n => -n.monetization_score,
  growth:       n => -n.growth_score,
};

const TIER_FILTER = {
  all:    () => true,
  prime:  n => oppScore(n) >= 80,
  strong: n => oppScore(n) >= 65 && oppScore(n) < 80,
  solid:  n => oppScore(n) >= 50 && oppScore(n) < 65,
  weak:   n => oppScore(n) < 50,
};

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ savedCount, compareCount, showSaved, onToggleSaved, onShowCompare }) {
  return (
    <header style={{
      borderBottom: "1px solid var(--border)", padding: "18px 28px",
      background: "linear-gradient(180deg, var(--bg-2), var(--bg))",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
              boxShadow: "0 0 10px #4ade80", animation: "blink 2s ease infinite",
            }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#4ade80", letterSpacing: "0.2em" }}>
              NICHE INTELLIGENCE · CLAUDE-POWERED
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--display)", fontSize: 24, fontWeight: 800,
            color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1,
          }}>
            Reddit Niche Finder
          </h1>
        </div>

        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          {compareCount >= 2 && (
            <button onClick={onShowCompare} style={{
              background: "#60a5fa14", color: "#60a5fa", border: "1px solid #60a5fa33",
              borderRadius: 8, padding: "7px 13px", fontSize: 10, letterSpacing: "0.08em",
              cursor: "pointer", fontFamily: "var(--mono)", transition: "all .15s",
            }}>
              ⇄ COMPARE ({compareCount})
            </button>
          )}
          <button onClick={onToggleSaved} style={{
            background: showSaved ? "#fbbf2414" : "var(--bg-card)",
            color: showSaved ? "#fbbf24" : "var(--text-muted)",
            border: `1px solid ${showSaved ? "#fbbf2433" : "var(--border)"}`,
            borderRadius: 8, padding: "7px 13px", fontSize: 10, letterSpacing: "0.08em",
            cursor: "pointer", fontFamily: "var(--mono)", transition: "all .15s",
          }}>
            ★ SAVED{savedCount > 0 ? ` (${savedCount})` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Controls bar ──────────────────────────────────────────────────────────────
function Controls({ category, setCategory, topic, setTopic, loading, onDiscover }) {
  return (
    <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)", padding: "14px 28px" }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        display: "flex", gap: 9, flexWrap: "wrap", alignItems: "flex-end",
      }}>
        <div style={{ flex: "0 0 190px" }}>
          <Label>CATEGORY</Label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 7, color: "var(--text-muted)", padding: "9px 10px", fontSize: 11,
            }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 230 }}>
          <Label>CUSTOM TOPIC (overrides category)</Label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && onDiscover()}
            placeholder='e.g. "AI tools for freelancers" or "senior dog care"'
            style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 7, color: "var(--text)", padding: "9px 10px", fontSize: 11,
              transition: "border-color .15s",
            }}
            onFocus={e => e.target.style.borderColor = "#4ade8055"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>
        <button
          onClick={onDiscover}
          disabled={loading}
          style={{
            flexShrink: 0,
            background: loading ? "var(--bg-card)" : "linear-gradient(135deg, #4ade80, #22c55e)",
            color: loading ? "var(--text-dim)" : "#030a06",
            borderRadius: 8, padding: "9px 22px", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.07em", cursor: loading ? "not-allowed" : "pointer",
            border: "none", fontFamily: "var(--mono)", transition: "all .2s",
          }}
        >
          {loading ? "SCANNING…" : "▶  DISCOVER"}
        </button>
      </div>
    </div>
  );
}

// ── Toolbar (sort / tier / view) ──────────────────────────────────────────────
function Toolbar({ sortBy, setSortBy, tierFilter, setTierFilter, cardView, setCardView, count }) {
  return (
    <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)", padding: "9px 28px" }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center",
      }}>
        <Group label="SORT">
          {SORT_OPTIONS.map(s => (
            <Chip key={s} active={sortBy === s} color="#4ade80" onClick={() => setSortBy(s)}>
              {s.toUpperCase()}
            </Chip>
          ))}
        </Group>
        <Divider />
        <Group label="TIER">
          {TIER_OPTIONS.map(t => (
            <Chip key={t} active={tierFilter === t} color="#60a5fa" onClick={() => setTierFilter(t)}>
              {t.toUpperCase()}
            </Chip>
          ))}
        </Group>
        <Divider />
        <Group label="VIEW">
          <Chip active={cardView === "bars"}  color="#c084fc" onClick={() => setCardView("bars")}>▦ BARS</Chip>
          <Chip active={cardView === "radar"} color="#c084fc" onClick={() => setCardView("radar")}>◉ RADAR</Chip>
        </Group>
        <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 9, color: "var(--border-2)" }}>
          {count} results
        </span>
      </div>
    </div>
  );
}

// ── Small reusables ───────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{
      fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)",
      letterSpacing: "0.14em", marginBottom: 5,
    }}>
      {children}
    </div>
  );
}

function Group({ label, children }) {
  return (
    <>
      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-dim)", letterSpacing: "0.1em", marginRight: 2 }}>
        {label}
      </span>
      {children}
    </>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 12, background: "var(--border)", margin: "0 4px" }} />;
}

function Chip({ active, color, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 9, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.07em",
      fontFamily: "var(--mono)", cursor: "pointer", transition: "all .15s",
      border: `1px solid ${active ? color + "55" : "var(--border)"}`,
      background: active ? `${color}12` : "transparent",
      color: active ? color : "var(--text-dim)",
    }}>
      {children}
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>🎯</div>
      <h2 style={{
        fontFamily: "var(--display)", fontSize: 20, fontWeight: 700,
        color: "var(--text-dim)", marginBottom: 8,
      }}>
        Select a category and hit Discover
      </h2>
      <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--border-2)" }}>
        12 scored niches per scan · ★ to save · +CMP to compare up to 4
      </p>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const {
    niches, loading, error, lastTopic,
    saved, history,
    discover, toggleSave, removeSaved, clearHistory, isSaved,
  } = useNiches();

  const [category,     setCategory]     = useState("All Categories");
  const [topic,        setTopic]        = useState("");
  const [sortBy,       setSortBy]       = useState("overall");
  const [tierFilter,   setTierFilter]   = useState("all");
  const [cardView,     setCardView]     = useState("bars");
  const [showSaved,    setShowSaved]    = useState(false);
  const [compareList,  setCompareList]  = useState([]);
  const [showCompare,  setShowCompare]  = useState(false);

  const handleDiscover = () => discover(topic.trim() || category);

  const toggleCompare = (niche) => {
    setCompareList(prev => {
      const exists = prev.some(c => c.name === niche.name);
      if (exists) return prev.filter(c => c.name !== niche.name);
      if (prev.length >= 4) return prev;
      return [...prev, niche];
    });
  };

  const ran = niches.length > 0 || loading || !!error;

  const sorted = [...niches]
    .sort((a, b) => SORT_KEY[sortBy](a) - SORT_KEY[sortBy](b))
    .filter(TIER_FILTER[tierFilter]);

  const rightPad = showSaved ? "360px" : "28px";

  return (
    <>
      <Header
        savedCount={saved.length}
        compareCount={compareList.length}
        showSaved={showSaved}
        onToggleSaved={() => setShowSaved(s => !s)}
        onShowCompare={() => setShowCompare(true)}
      />

      <Controls
        category={category} setCategory={setCategory}
        topic={topic} setTopic={setTopic}
        loading={loading} onDiscover={handleDiscover}
      />

      {niches.length > 0 && (
        <Toolbar
          sortBy={sortBy} setSortBy={setSortBy}
          tierFilter={tierFilter} setTierFilter={setTierFilter}
          cardView={cardView} setCardView={setCardView}
          count={sorted.length}
        />
      )}

      {/* Main content */}
      <main style={{
        maxWidth: 1180, margin: "0 auto",
        padding: `26px 28px 26px 28px`,
        paddingRight: rightPad,
        transition: "padding-right .3s ease",
      }}>
        {/* History */}
        {!loading && history.length > 0 && (
          <ScanHistory
            history={history}
            onRerun={t => { setTopic(t); discover(t); }}
            onClear={clearHistory}
          />
        )}

        {loading && <Loader />}

        {error && (
          <div style={{
            textAlign: "center", padding: 40,
            fontFamily: "var(--mono)", fontSize: 12, color: "var(--red)",
          }}>
            ⚠ {error}
          </div>
        )}

        {!ran && <EmptyState />}

        {sorted.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: 13,
          }}>
            {sorted.map((n, i) => (
              <NicheCard
                key={n.name}
                niche={n}
                rank={i + 1}
                animDelay={i * 55}
                isSaved={isSaved(n.name)}
                inCompare={compareList.some(c => c.name === n.name)}
                onSave={toggleSave}
                onCompare={toggleCompare}
                view={cardView}
              />
            ))}
          </div>
        )}
      </main>

      {showSaved && (
        <SavedDrawer
          saved={saved}
          compareList={compareList}
          onRemove={removeSaved}
          onCompare={toggleCompare}
          onLaunchCompare={() => setShowCompare(true)}
          onClose={() => setShowSaved(false)}
        />
      )}

      {showCompare && compareList.length >= 2 && (
        <CompareModal
          niches={compareList}
          onClose={() => setShowCompare(false)}
        />
      )}
    </>
  );
}
