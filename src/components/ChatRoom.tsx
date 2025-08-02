import React, { useState, useCallback } from 'react';
import { VideoChat } from './VideoChat';
import { TextChat } from './TextChat';
import { Button } from '@/components/ui/button';
import { Play, Users, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

export const ChatRoom: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);

  const simulateConnection = useCallback(() => {
    setIsConnecting(true);
    setIsConnected(false);
    
    // Simulate finding a person (2-5 seconds)
    const connectionTime = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionCount(prev => prev + 1);
      
      // Add a welcome message from the "stranger"
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hi there! 👋",
        isOwn: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, connectionTime);
  }, []);

  const handleStartChat = () => {
    simulateConnection();
  };

  const handleNext = () => {
    setMessages([]);
    simulateConnection();
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);
    setMessages([]);
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isOwn: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate stranger reply (sometimes)
    if (Math.random() > 0.3) {
      const replies = [
        "That's interesting!",
        "Tell me more about that",
        "I agree!",
        "Hmm, what do you think about...",
        "Nice! Where are you from?",
        "Cool! I'm from [location]",
        "What are your hobbies?",
        "Haha, that's funny!",
        "Really? That's amazing!",
        "I see, interesting perspective"
      ];
      
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: replies[Math.floor(Math.random() * replies.length)],
          isOwn: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, reply]);
      }, 1000 + Math.random() * 2000);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RandomChat</h1>
              <p className="text-sm text-muted-foreground">Connect with strangers worldwide</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Connections: </span>
              <span className="font-semibold">{connectionCount}</span>
            </div>
            
            {!isConnected && !isConnecting && (
              <Button 
                variant="next" 
                size="lg"
                onClick={handleStartChat}
                className="font-semibold"
              >
                <Play className="w-5 h-5" />
                Start Chat
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Video Section */}
        <div className="flex-1 min-h-0">
          <VideoChat
            onNext={handleNext}
            onEndCall={handleEndCall}
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </div>

        {/* Chat Section */}
        <div className="w-96 min-h-0">
          <TextChat
            isConnected={isConnected}
            onSendMessage={handleSendMessage}
            messages={messages}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-card/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Be respectful and have fun! Your safety is important.
          </p>
        </div>
      </footer>
    </div>
  );
};