// src/components/ScanHistory.jsx

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ScanHistory({ history, onRerun, onClear }) {
  if (history.length === 0) return null;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 10,
      }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.12em" }}>
          RECENT SCANS
        </span>
        <button onClick={onClear}
          style={{
            fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)",
            background: "transparent", border: "none", cursor: "pointer", letterSpacing: "0.06em",
          }}
        >
          CLEAR
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {history.map(h => (
          <button key={h.id} onClick={() => onRerun(h.topic)}
            style={{
              fontFamily: "var(--mono)", fontSize: 10, padding: "5px 12px", borderRadius: 20,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              color: "var(--text-2)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7,
              transition: "border-color .15s, color .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade8044"; e.currentTarget.style.color = "#4ade80"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
          >
            <span>{h.topic}</span>
            <span style={{ color: "var(--text-dim)", fontSize: 9 }}>{timeAgo(h.at)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
