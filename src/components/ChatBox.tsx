
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGame } from './GameProvider';

const ChatBox = () => {
  const { messages, addMessage, username, gameState } = useGame();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && gameState === 'playing') {
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

  return (
    <div className="flex flex-col h-full border-4 border-white rounded-xl bg-white shadow-md overflow-hidden">
      <div className="p-3 bg-game-primary text-white font-bold text-lg">
        Chat & Guesses
      </div>
      
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 p-4 bg-game-chat"
      >
        <div className="flex flex-col">
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
          placeholder={gameState === 'playing' ? "Type your guess..." : "Waiting for round to start..."}
          disabled={gameState !== 'playing'}
          className="flex-1 rounded-lg border-2 border-gray-300 focus:border-game-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={gameState !== 'playing'}
          className="bg-game-primary hover:bg-game-primary/90 h-10 w-10 rounded-lg"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
