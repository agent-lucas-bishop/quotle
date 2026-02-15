import { useState, useRef, useEffect } from 'react';
import { authors } from '../data/quotes';

interface GuessInputProps {
  onGuess: (name: string) => void;
  disabled: boolean;
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleChange = (val: string) => {
    setValue(val);
    setSelectedIdx(-1);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    const lower = val.toLowerCase();
    const filtered = authors.filter(a => a.toLowerCase().includes(lower)).slice(0, 8);
    setSuggestions(filtered);
  };

  const submit = (name: string) => {
    if (!name.trim()) return;
    onGuess(name.trim());
    setValue('');
    setSuggestions([]);
    setSelectedIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && suggestions[selectedIdx]) {
        submit(suggestions[selectedIdx]);
      } else if (suggestions.length === 1) {
        submit(suggestions[0]);
      } else if (value.trim()) {
        submit(value);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIdx(-1);
    }
  };

  if (disabled) return null;

  return (
    <div className="guess-input-wrapper">
      <div className="guess-input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Who said this?"
          className="guess-input"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="guess-submit"
          onClick={() => {
            if (selectedIdx >= 0 && suggestions[selectedIdx]) submit(suggestions[selectedIdx]);
            else if (suggestions.length === 1) submit(suggestions[0]);
            else if (value.trim()) submit(value);
          }}
          disabled={!value.trim()}
        >
          Guess
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={s}
              className={`suggestion ${i === selectedIdx ? 'selected' : ''}`}
              onMouseDown={() => submit(s)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
