// src/hooks/useNiches.js
import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY_SAVED   = "nf_saved_niches";
const STORAGE_KEY_HISTORY = "nf_scan_history";
const MAX_HISTORY = 10;

export const WEIGHTS = {
  trend: 0.25,
  competition: 0.25,
  monetization: 0.20,
  growth: 0.15,
  viability: 0.15,
};

export function oppScore(n) {
  return Math.round(
    n.trend_score        * WEIGHTS.trend +
    n.competition_score  * WEIGHTS.competition +
    n.monetization_score * WEIGHTS.monetization +
    n.growth_score       * WEIGHTS.growth +
    n.viability_score    * WEIGHTS.viability
  );
}

export function tier(score) {
  if (score >= 80) return { label: "PRIME",  color: "#4ade80", bg: "#4ade8014" };
  if (score >= 65) return { label: "STRONG", color: "#60a5fa", bg: "#60a5fa14" };
  if (score >= 50) return { label: "SOLID",  color: "#fbbf24", bg: "#fbbf2414" };
  return              { label: "WEAK",   color: "#f87171", bg: "#f8717114" };
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function useNiches() {
  const [niches,   setNiches]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [lastTopic,setLastTopic]= useState(null);
  const [saved,    setSaved]    = useState(() => load(STORAGE_KEY_SAVED, []));
  const [history,  setHistory]  = useState(() => load(STORAGE_KEY_HISTORY, []));

  // Persist saved whenever it changes
  useEffect(() => { save(STORAGE_KEY_SAVED, saved); }, [saved]);
  useEffect(() => { save(STORAGE_KEY_HISTORY, history); }, [history]);

  const discover = useCallback(async (topic) => {
    if (!topic?.trim()) return;
    setLoading(true);
    setError(null);
    setNiches([]);
    setLastTopic(topic);

    try {
      const res = await fetch("/.netlify/functions/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Server error");
      }

      const results = data.niches;
      setNiches(results);

      // Add to history
      const entry = {
        id:      Date.now(),
        topic,
        count:   results.length,
        topOpp:  Math.max(...results.map(oppScore)),
        at:      new Date().toISOString(),
      };
      setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      setError(err.message || "Failed to load niches. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSave = useCallback((niche) => {
    setSaved(prev => {
      const exists = prev.some(n => n.name === niche.name);
      return exists ? prev.filter(n => n.name !== niche.name) : [...prev, niche];
    });
  }, []);

  const removeSaved = useCallback((name) => {
    setSaved(prev => prev.filter(n => n.name !== name));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const isSaved = useCallback((name) => saved.some(n => n.name === name), [saved]);

  return {
    niches, loading, error, lastTopic,
    saved, history,
    discover, toggleSave, removeSaved, clearHistory, isSaved,
  };
}
