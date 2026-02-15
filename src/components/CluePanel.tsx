interface CluePanelProps {
  clues: { label: string; value: string }[];
}

export function CluePanel({ clues }: CluePanelProps) {
  if (clues.length === 0) return null;
  return (
    <div className="clue-panel">
      <h3 className="clue-title">Clues</h3>
      <div className="clue-grid">
        {clues.map(c => (
          <div key={c.label} className="clue-item">
            <span className="clue-label">{c.label}</span>
            <span className="clue-value">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
