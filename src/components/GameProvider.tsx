
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

type GameState = 'waiting' | 'playing' | 'roundEnd';

interface GameContextType {
  gameState: GameState;
  currentWord: string | null;
  timer: number;
  score: number;
  username: string;
  messages: Message[];
  startGame: () => void;
  endGame: () => void;
  setUsername: (name: string) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  correctGuess: () => void;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  type: 'user' | 'system' | 'correct';
  timestamp: Date;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GAME_DURATION = 60; // seconds, now exported
const FIXED_WORD = 'apple'; // Changed to "apple" as the correct guess

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('Player');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      text: 'Welcome to Guess Leonardo! Watch as Leonardo the robot draws, and guess what it is!',
      type: 'system',
      timestamp: new Date(),
    },
  ]);

  const { toast } = useToast();

  const startGame = () => {
    setCurrentWord(FIXED_WORD);
    setGameState('playing');
    setTimer(GAME_DURATION);
    
    toast({
      title: "Leonardo is drawing...",
      description: "Try to guess what the robot is drawing!",
      duration: 5000,
    });

    addMessage({
      sender: 'System',
      text: 'Leonardo has started drawing! Try to guess what it is!',
      type: 'system',
      timestamp: new Date(),
    });
  };

  const endGame = () => {
    setGameState('roundEnd');
    setCurrentWord(null);
    addMessage({
      sender: 'System',
      text: 'Round ended! Leonardo has stopped drawing.',
      type: 'system',
      timestamp: new Date(),
    });
  };

  const correctGuess = () => {
    // Calculate score based on time left (percentage)
    const timeLeftPercentage = timer / GAME_DURATION;
    const pointsEarned = Math.round(1000 * timeLeftPercentage);
    
    console.log("Correct guess! Points earned:", pointsEarned, "Time left percentage:", timeLeftPercentage);
    
    // Update score state with the newly earned points
    setScore(prevScore => {
      const newScore = prevScore + pointsEarned;
      console.log("Previous score:", prevScore, "New score:", newScore);
      return newScore;
    });
    
    addMessage({
      sender: 'System',
      text: `Correct! You identified an apple! You earned ${pointsEarned} points!`,
      type: 'correct',
      timestamp: new Date(),
    });
    
    setGameState('roundEnd');
    setCurrentWord(null);
    
    toast({
      title: "Good job!",
      description: `+${pointsEarned} points added to your score!`,
      duration: 3000,
    });
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Only process guesses if the game is in 'playing' state
    if (
      gameState === 'playing' && 
      message.type === 'user' && 
      currentWord && 
      message.text.toLowerCase().includes(currentWord.toLowerCase())
    ) {
      correctGuess();
    }
  };

  useEffect(() => {
    let interval: number;
    
    if (gameState === 'playing' && timer > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timer]);

  const value = {
    gameState,
    currentWord,
    timer,
    score,
    username,
    messages,
    startGame,
    endGame,
    setUsername,
    addMessage,
    correctGuess,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
