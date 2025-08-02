import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

interface TextChatProps {
  isConnected: boolean;
  onSendMessage: (message: string) => void;
  messages: Message[];
}

export const TextChat: React.FC<TextChatProps> = ({
  isConnected,
  onSendMessage,
  messages
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && isConnected) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="h-full flex flex-col bg-chat-bg rounded-xl border border-border/50">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 bg-card/30 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Chat</span>
          </div>
          <div className={`ml-auto flex items-center gap-2 ${isConnected ? 'status-online' : 'status-offline'}`}>
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-sm font-medium">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isConnected 
                  ? 'Start the conversation by sending a message!' 
                  : 'Connect with someone to start chatting'
                }
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 transition-smooth ${
                    message.isOwn
                      ? 'gradient-primary text-primary-foreground'
                      : 'chat-message text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connect to chat"}
            disabled={!isConnected}
            className="flex-1 bg-input/50 border-border/50 focus:border-primary/50 transition-smooth"
            maxLength={1000}
          />
          <Button
            type="submit"
            variant={messageText.trim() ? "default" : "outline"}
            size="icon"
            disabled={!messageText.trim() || !isConnected}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {isConnected ? 'Connected' : 'Waiting for connection...'}
          </span>
          <span>{messageText.length}/1000</span>
        </div>
      </form>
    </div>
  );
};