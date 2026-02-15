import type { Guess } from '../hooks/useGame';

interface GuessListProps {
  guesses: Guess[];
  maxGuesses: number;
}

export function GuessList({ guesses, maxGuesses }: GuessListProps) {
  return (
    <div className="guess-list">
      {guesses.map((g, i) => (
        <div key={i} className={`guess-row ${g.correct ? 'correct' : 'wrong'}`}>
          <span className="guess-icon">{g.correct ? '📜' : '❌'}</span>
          <span className="guess-name">{g.name}</span>
          <span className="guess-number">{i + 1}/{maxGuesses}</span>
        </div>
      ))}
    </div>
  );
}
