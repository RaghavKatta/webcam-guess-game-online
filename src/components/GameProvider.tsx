
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

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

const GAME_DURATION = 60; // seconds
const FIXED_WORD = 'apple'; // The fixed word to guess

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
      text: 'Welcome to Webcam Guess! Show an object on camera for others to guess.',
      type: 'system',
      timestamp: new Date(),
    },
  ]);

  const { toast } = useToast();

  const startGame = () => {
    // Use the fixed word instead of getting a random one
    setCurrentWord(FIXED_WORD);
    setGameState('playing');
    setTimer(GAME_DURATION);
    
    // Notify only the presenter about the word
    toast({
      title: "Your word to present is:",
      description: FIXED_WORD,
      duration: 5000,
    });

    addMessage({
      sender: 'System',
      text: 'New round started! Start guessing what you see!',
      type: 'system',
      timestamp: new Date(),
    });
  };

  const endGame = () => {
    setGameState('roundEnd');
    setCurrentWord(null);
    addMessage({
      sender: 'System',
      text: 'Round ended!',
      type: 'system',
      timestamp: new Date(),
    });
  };

  const correctGuess = () => {
    addMessage({
      sender: 'System',
      text: `Correct! The word was "${currentWord}"`,
      type: 'correct',
      timestamp: new Date(),
    });
    setScore(prev => prev + 10);
    setGameState('roundEnd');
    setCurrentWord(null);
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Check if the message is a correct guess (case-insensitive)
    if (
      gameState === 'playing' && 
      message.type === 'user' && 
      currentWord && 
      message.text.toLowerCase().includes(currentWord.toLowerCase())
    ) {
      correctGuess();
    }
  };

  // Timer effect
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
