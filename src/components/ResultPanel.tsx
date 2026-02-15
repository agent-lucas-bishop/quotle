import { useState } from 'react';
import type { Quote } from '../data/quotes';
import type { Stats } from '../hooks/useGame';

interface ResultPanelProps {
  quote: Quote;
  won: boolean;
  guessCount: number;
  shareText: string;
  stats: Stats;
}

export function ResultPanel({ quote, won, guessCount, shareText, stats }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxDist = Math.max(...stats.distribution, 1);

  return (
    <div className="result-panel">
      <div className="result-header">
        {won ? (
          <h2 className="result-title result-win">🎉 Brilliant!</h2>
        ) : (
          <h2 className="result-title result-loss">The answer was...</h2>
        )}
        <p className="result-author">— {quote.author}</p>
      </div>

      <div className="fun-fact">
        <h3>About this quote</h3>
        <p>{quote.funFact}</p>
      </div>

      <button className="share-btn" onClick={handleShare}>
        {copied ? '✓ Copied!' : '📋 Share Result'}
      </button>

      <div className="stats-panel">
        <h3>Your Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-number">{stats.played}</span>
            <span className="stat-label">Played</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.streak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.maxStreak}</span>
            <span className="stat-label">Max Streak</span>
          </div>
        </div>

        <div className="distribution">
          <h4>Guess Distribution</h4>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="dist-row">
              <span className="dist-label">{n}</span>
              <div className="dist-bar-bg">
                <div
                  className={`dist-bar ${won && guessCount === n ? 'dist-bar-active' : ''}`}
                  style={{ width: `${Math.max((stats.distribution[n - 1] / maxDist) * 100, 4)}%` }}
                >
                  {stats.distribution[n - 1]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
