interface QuoteCardProps {
  text: string;
}

export function QuoteCard({ text }: QuoteCardProps) {
  return (
    <div className="quote-card">
      <span className="quote-mark quote-mark-open">"</span>
      <p className="quote-text">{text}</p>
      <span className="quote-mark quote-mark-close">"</span>
    </div>
  );
}
