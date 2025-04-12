
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGame } from './GameProvider';
import { Progress } from '@/components/ui/progress';
import { GAME_DURATION } from './GameProvider';

const ChatBox = () => {
  const { messages, addMessage, username, gameState, currentWord, timer, hasGuessedCorrectly } = useGame();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to check if a message includes the current word
  const isCorrectGuess = (text: string) => {
    if (!currentWord) return false;
    return text.toLowerCase().includes(currentWord.toLowerCase());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && gameState === 'playing' && !hasGuessedCorrectly) {
      addMessage({
        sender: username,
        text: message,
        type: 'user',
        timestamp: new Date(),
      });
      
      setMessage('');
      
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Get placeholder text based on game state
  const getPlaceholderText = () => {
    if (gameState === 'playing') {
      if (hasGuessedCorrectly) {
        return "You got it right! Wait for the next round...";
      }
      return "What is Leonardo drawing?";
    } else if (gameState === 'roundEnd') {
      return "Drawing complete - wait for next round";
    } else {
      return "Waiting for Leonardo to start drawing...";
    }
  };

  return (
    <div className="flex flex-col h-[400px] border-4 border-white rounded-xl bg-white shadow-md overflow-hidden mt-4">
      <div className="p-3 bg-game-primary text-white font-bold text-lg">
        Guesses & Chat
      </div>
      
      {gameState === 'playing' && (
        <div className="px-3 py-2 bg-gray-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Time to guess:</span>
            <span className="text-sm font-bold">{timer}s</span>
          </div>
          <Progress value={(timer / GAME_DURATION) * 100} className="h-2" />
        </div>
      )}
      
      <ScrollArea 
        className="flex-1 p-4 bg-game-chat overflow-y-auto"
        style={{ maxHeight: "calc(100% - 120px)" }}
      >
        <div className="flex flex-col" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-message ${msg.type}`}
            >
              {msg.type === 'user' && (
                <div className="font-bold text-sm">
                  {msg.sender}:
                </div>
              )}
              <div>{msg.text}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <form 
        onSubmit={handleSendMessage} 
        className="p-3 border-t-2 border-gray-200 flex gap-2"
      >
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={getPlaceholderText()}
          disabled={gameState !== 'playing' || hasGuessedCorrectly}
          className="flex-1 rounded-lg border-2 border-gray-300 focus:border-game-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={gameState !== 'playing' || hasGuessedCorrectly}
          className="bg-game-primary hover:bg-game-primary/90 h-10 w-10 rounded-lg"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
