import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

interface Message {
  id: number;
  userId: number;
  username: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  userId?: number;
}

export const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket } = useGame();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on('new-message', handleMessage);

    // Clean up listener
    return () => {
      socket.off('new-message', handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    // Send message via socket
    socket.emit('send-message', {
      userId,
      channelId: 'global',
      message: newMessage
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container bg-gray-800 border-t border-gray-700">
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className="mb-2 p-2 bg-gray-700 rounded">
            <div className="flex items-center mb-1">
              <span className="font-bold text-blue-300">{message.username}</span>
              <span className="ml-2 text-xs text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p>{message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};