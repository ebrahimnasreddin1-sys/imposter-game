import { useState, useCallback } from 'react';
import SetupScreen from './screens/SetupScreen';
import CategoryScreen from './screens/CategoryScreen';
import PassScreen from './screens/PassScreen';
import SuspenseScreen from './screens/SuspenseScreen';
import RevealScreen from './screens/RevealScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import FinalGuessScreen from './screens/FinalGuessScreen';
import RoundResultScreen from './screens/RoundResultScreen';
import FinalResultsScreen from './screens/FinalResultsScreen';
import {
  selectSecretWord, selectRandomImposter, generateGuessOptions,
  updateScores, shuffle
} from './utils/gameLogic';

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imposterIndex, setImposterIndex] = useState(null);
  const [secretChar, setSecretChar] = useState(null);     // character OBJECT { name, fullName, image }
  const [revealOrder, setRevealOrder] = useState([]);
  const [currentRevealIdx, setCurrentRevealIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [previousImposter, setPreviousImposter] = useState(null);
  const [guessOptions, setGuessOptions] = useState([]);   // array of character OBJECTS
  const [roundWinner, setRoundWinner] = useState(null);

  // ── Setup complete ──
  const handleSetupContinue = useCallback((playerNames, rounds) => {
    setPlayers(playerNames);
    setTotalRounds(rounds);
    setCurrentRound(1);
    const initScores = {};
    playerNames.forEach(n => { initScores[n] = 0; });
    setScores(initScores);
    setPreviousImposter(null);
    setScreen('category');
  }, []);

  // ── Category selected → start round ──
  const startRound = useCallback((category) => {
    setSelectedCategory(category);
    const charObj = selectSecretWord(category);       // returns { name, fullName, image }
    const imp = selectRandomImposter(players.length, previousImposter);
    const order = shuffle([...Array(players.length).keys()]);
    setSecretChar(charObj);
    setImposterIndex(imp);
    setRevealOrder(order);
    setCurrentRevealIdx(0);
    setGuessOptions(generateGuessOptions(category, charObj));  // array of char objects
    setScreen('pass');
  }, [players, previousImposter]);

  // ── Pass → Suspense ──
  const handleTapReveal = useCallback(() => {
    setScreen('suspense');
  }, []);

  // ── Suspense done → Reveal ──
  const handleSuspenseDone = useCallback(() => {
    setScreen('reveal');
  }, []);

  // ── Reveal auto-hide → next player or discussion ──
  const handleRevealDone = useCallback(() => {
    if (currentRevealIdx < revealOrder.length - 1) {
      setCurrentRevealIdx(prev => prev + 1);
      setScreen('pass');
    } else {
      setScreen('discussion');
    }
  }, [currentRevealIdx, revealOrder]);

  // ── End discussion → final guess ──
  const handleEndRound = useCallback(() => {
    setScreen('finalGuess');
  }, []);

  // ── Imposter guessed ──
  const handleGuess = useCallback((correct) => {
    const winner = correct ? 'imposter' : 'crewmates';
    setRoundWinner(winner);
    setScores(prev => updateScores(prev, players, imposterIndex, correct));
    setPreviousImposter(imposterIndex);
    setTimeout(() => setScreen('roundResult'), 500);
  }, [players, imposterIndex]);

  // ── Next round (same category) ──
  const handleNextRound = useCallback(() => {
    setCurrentRound(prev => prev + 1);
    startRound(selectedCategory);
  }, [selectedCategory, startRound]);

  // ── Next round (change category) ──
  const handleChangeCategory = useCallback(() => {
    setCurrentRound(prev => prev + 1);
    setScreen('category');
  }, []);

  // ── Show final results ──
  const handleFinalResults = useCallback(() => {
    setScreen('finalResults');
  }, []);

  // ── Play again with same players ──
  const handlePlayAgain = useCallback(() => {
    setCurrentRound(1);
    const resetScores = {};
    players.forEach(n => { resetScores[n] = 0; });
    setScores(resetScores);
    setPreviousImposter(null);
    setScreen('category');
  }, [players]);

  // ── New game ──
  const handleNewGame = useCallback(() => {
    setScreen('setup');
    setPlayers([]);
    setScores({});
    setPreviousImposter(null);
    setCurrentRound(1);
  }, []);

  // ── Reset scores (stay on final) ──
  const handleResetScores = useCallback(() => {
    const resetScores = {};
    players.forEach(n => { resetScores[n] = 0; });
    setScores(resetScores);
  }, [players]);

  // ── Current reveal player info ──
  const currentPlayerIdx = revealOrder[currentRevealIdx];
  const currentPlayerName = players[currentPlayerIdx] || '';
  const isCurrentImposter = currentPlayerIdx === imposterIndex;

  return (
    <div className="h-full w-full max-w-lg mx-auto relative overflow-hidden bg-zinc-950">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)' }} />

      {screen === 'setup' && (
        <SetupScreen onContinue={handleSetupContinue} />
      )}

      {screen === 'category' && (
        <CategoryScreen
          onSelect={startRound}
          currentRound={currentRound}
          totalRounds={totalRounds}
        />
      )}

      {screen === 'pass' && (
        <PassScreen
          playerName={currentPlayerName}
          onReveal={handleTapReveal}
        />
      )}

      {screen === 'suspense' && (
        <SuspenseScreen onComplete={handleSuspenseDone} />
      )}

      {screen === 'reveal' && (
        <RevealScreen
          playerName={currentPlayerName}
          isImposter={isCurrentImposter}
          secretChar={secretChar}
          category={selectedCategory}
          onDone={handleRevealDone}
        />
      )}

      {screen === 'discussion' && (
        <DiscussionScreen
          players={players}
          onEndRound={handleEndRound}
        />
      )}

      {screen === 'finalGuess' && (
        <FinalGuessScreen
          imposterName={players[imposterIndex]}
          options={guessOptions}
          secretChar={secretChar}
          onGuess={handleGuess}
        />
      )}

      {screen === 'roundResult' && (
        <RoundResultScreen
          imposterName={players[imposterIndex]}
          secretChar={secretChar}
          roundWinner={roundWinner}
          scores={scores}
          players={players}
          currentRound={currentRound}
          totalRounds={totalRounds}
          category={selectedCategory}
          onNextRound={handleNextRound}
          onChangeCategory={handleChangeCategory}
          onFinalResults={handleFinalResults}
        />
      )}

      {screen === 'finalResults' && (
        <FinalResultsScreen
          players={players}
          scores={scores}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
          onResetScores={handleResetScores}
        />
      )}
    </div>
  );
}
