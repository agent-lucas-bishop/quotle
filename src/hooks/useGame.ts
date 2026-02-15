import { useState, useEffect, useCallback } from 'react';
import { getDailyQuote, getEra, getCentury } from '../data/quotes';
import type { Quote } from '../data/quotes';

export interface Guess {
  name: string;
  correct: boolean;
}

export interface GameState {
  quote: Quote;
  guesses: Guess[];
  gameOver: boolean;
  won: boolean;
  dateKey: string;
}

export interface Stats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
  distribution: number[]; // guesses 1-6 + loss
}

const getDateKey = () => new Date().toISOString().split('T')[0];

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem('quotle-stats');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { played: 0, won: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0, 0] };
}

function saveStats(stats: Stats) {
  localStorage.setItem('quotle-stats', JSON.stringify(stats));
}

function loadGame(dateKey: string): Guess[] | null {
  try {
    const raw = localStorage.getItem(`quotle-game-${dateKey}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveGame(dateKey: string, guesses: Guess[]) {
  localStorage.setItem(`quotle-game-${dateKey}`, JSON.stringify(guesses));
}

export function useGame() {
  const dateKey = getDateKey();
  const quote = getDailyQuote(dateKey);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [stats, setStats] = useState<Stats>(loadStats);
  const [statsRecorded, setStatsRecorded] = useState(false);

  const won = guesses.some(g => g.correct);
  const gameOver = won || guesses.length >= 6;

  useEffect(() => {
    const saved = loadGame(dateKey);
    if (saved) {
      setGuesses(saved);
      setStatsRecorded(true); // Already played today
    }
  }, [dateKey]);

  useEffect(() => {
    if (gameOver && !statsRecorded && guesses.length > 0) {
      const newStats = { ...stats };
      newStats.played++;
      if (won) {
        newStats.won++;
        newStats.streak++;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
        newStats.distribution[guesses.length - 1]++;
      } else {
        newStats.streak = 0;
        newStats.distribution[6]++;
      }
      setStats(newStats);
      saveStats(newStats);
      setStatsRecorded(true);
    }
  }, [gameOver, won, statsRecorded, guesses.length]);

  const submitGuess = useCallback((name: string) => {
    if (gameOver) return;
    const correct = name.toLowerCase() === quote.author.toLowerCase();
    const newGuesses = [...guesses, { name, correct }];
    setGuesses(newGuesses);
    saveGame(dateKey, newGuesses);
  }, [guesses, gameOver, quote.author, dateKey]);

  const getClues = useCallback(() => {
    const clues: { label: string; value: string }[] = [];
    const n = guesses.length;
    if (n >= 1) clues.push({ label: 'Era', value: getEra(quote.birthYear) });
    if (n >= 2) clues.push({ label: 'Field', value: quote.field.charAt(0).toUpperCase() + quote.field.slice(1) });
    if (n >= 3) clues.push({ label: 'Nationality', value: quote.nationality });
    if (n >= 4) clues.push({ label: 'Century', value: getCentury(quote.birthYear) });
    if (n >= 5) clues.push({ label: 'Last Name Starts With', value: quote.author.split(' ').pop()![0] });
    return clues;
  }, [guesses.length, quote]);

  const getShareText = useCallback(() => {
    const emojis = guesses.map(g => g.correct ? '📜' : '❌').join('');
    const result = won ? `${guesses.length}/6` : 'X/6';
    return `Quotle ${dateKey} ${result}\n${emojis}\nhttps://quotle-game.vercel.app`;
  }, [guesses, won, dateKey]);

  return { quote, guesses, gameOver, won, stats, submitGuess, getClues, getShareText };
}
