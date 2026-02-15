import { QuoteCard } from './components/QuoteCard';
import { GuessInput } from './components/GuessInput';
import { GuessList } from './components/GuessList';
import { CluePanel } from './components/CluePanel';
import { ResultPanel } from './components/ResultPanel';
import { useGame } from './hooks/useGame';
import './App.css';

function App() {
  const { quote, guesses, gameOver, won, stats, submitGuess, getClues, getShareText } = useGame();

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Quotle</h1>
        <p className="subtitle">Guess who said it</p>
      </header>

      <main className="main">
        <QuoteCard text={quote.text} />

        {!gameOver && (
          <p className="guess-counter">
            Guess {guesses.length + 1} of 6
          </p>
        )}

        <GuessInput onGuess={submitGuess} disabled={gameOver} />

        <GuessList guesses={guesses} maxGuesses={6} />

        {!gameOver && <CluePanel clues={getClues()} />}

        {gameOver && (
          <ResultPanel
            quote={quote}
            won={won}
            guessCount={guesses.length}
            shareText={getShareText()}
            stats={stats}
          />
        )}
      </main>

      <footer className="footer">
        <p>A new quote every day · Built with 📚</p>
      </footer>
    </div>
  );
}

export default App;
