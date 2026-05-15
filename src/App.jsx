import { useState, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen';
import PlayersScreen from './screens/PlayersScreen';
import CategoryScreen from './screens/CategoryScreen';
import CategorySettingsScreen from './screens/CategorySettingsScreen';
import PassScreen from './screens/PassScreen';
import SuspenseScreen from './screens/SuspenseScreen';
import RevealScreen from './screens/RevealScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import VotingScreen from './screens/VotingScreen';
import FinalGuessScreen from './screens/FinalGuessScreen';
import RoundResultScreen from './screens/RoundResultScreen';
import FinalResultsScreen from './screens/FinalResultsScreen';
import {
  selectSecretWord, selectRandomImposter, generateGuessOptions,
  updateScores, shuffle
} from './utils/gameLogic';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [players, setPlayers] = useState([]);
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imposterIndex, setImposterIndex] = useState(null);
  const [secretChar, setSecretChar] = useState(null);     // character OBJECT { name }
  const [revealOrder, setRevealOrder] = useState([]);
  const [currentRevealIdx, setCurrentRevealIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [previousImposter, setPreviousImposter] = useState(null);
  const [guessOptions, setGuessOptions] = useState([]);   // array of character OBJECTS
  const [roundWinner, setRoundWinner] = useState(null);
  
  // Voting states
  const [votes, setVotes] = useState({}); // { playerName: votedForName }
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);

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

  // ── Home Actions ──
  const handleStartGame = useCallback(() => {
    if (players.length >= 2) {
      setScreen('category');
    } else {
      setScreen('players');
    }
  }, [players]);

  const handleOpenPlayers = useCallback(() => {
    setScreen('players');
  }, []);

  // ── Category selected → start round ──
  const startRound = useCallback((category) => {
    setSelectedCategory(category);
    const charObj = selectSecretWord(category);       // returns { name }
    const imp = selectRandomImposter(players.length, previousImposter);
    const order = shuffle([...Array(players.length).keys()]);
    setSecretChar(charObj);
    setImposterIndex(imp);
    setRevealOrder(order);
    setCurrentRevealIdx(0);
    setVotes({});
    setCurrentVoterIdx(0);
    setGuessOptions(generateGuessOptions(category, charObj));  // array of char objects
    setScreen('pass');
  }, [players, previousImposter]);

  // ── Open Category Settings ──
  const handleOpenSettings = useCallback((category) => {
    setSelectedCategory(category);
    setScreen('settings');
  }, []);

  // ── Close Category Settings ──
  const handleCloseSettings = useCallback(() => {
    setSelectedCategory(null);
    setScreen('category');
  }, []);

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

  // ── End discussion → Start Voting Phase ──
  const handleEndRound = useCallback(() => {
    setScreen('voting');
  }, []);

  // ── Handle Vote ──
  const handleVote = useCallback((voterName, votedForName) => {
    setVotes(prev => ({ ...prev, [voterName]: votedForName }));
    if (currentVoterIdx < players.length - 1) {
      setCurrentVoterIdx(prev => prev + 1);
    } else {
      // All players voted, go to final guess
      setScreen('finalGuess');
    }
  }, [currentVoterIdx, players.length]);

  // ── Imposter guessed ──
  const handleGuess = useCallback((correct) => {
    const winner = correct ? 'imposter' : 'crewmates';
    setRoundWinner(winner);
    setScores(prev => updateScores(prev, players, imposterIndex, correct, votes));
    setPreviousImposter(imposterIndex);
    setTimeout(() => setScreen('roundResult'), 500);
  }, [players, imposterIndex, votes]);

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
    setScreen('home');
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
    <div className="h-full w-full max-w-lg mx-auto relative overflow-hidden">

      {screen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGame}
          onOpenPlayers={handleOpenPlayers}
          onOpenSettings={() => handleOpenSettings(null)}
        />
      )}

      {screen === 'players' && (
        <PlayersScreen onContinue={handleSetupContinue} onBack={() => setScreen('home')} />
      )}

      {screen === 'category' && (
        <CategoryScreen
          onSelect={startRound}
          onOpenSettings={handleOpenSettings}
          onBack={() => setScreen('players')}
          currentRound={currentRound}
          totalRounds={totalRounds}
        />
      )}

      {screen === 'settings' && (
        <CategorySettingsScreen
          category={selectedCategory}
          onBack={handleCloseSettings}
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
          category={selectedCategory}
          currentRound={currentRound}
          onEndRound={handleEndRound}
        />
      )}

      {screen === 'voting' && (
        <VotingScreen
          players={players}
          currentVoterIdx={currentVoterIdx}
          onVote={handleVote}
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
          votes={votes}
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
