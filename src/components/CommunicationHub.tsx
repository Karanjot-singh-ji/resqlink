import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Phone, Video, Users, Search, Plus, Paperclip, Smile } from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  channelId: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'crisis' | 'general' | 'direct';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

interface CommunicationHubProps {
  user: User;
}

export default function CommunicationHub({ user }: CommunicationHubProps) {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [channels] = useState<Channel[]>([
    {
      id: 'general',
      name: 'General Discussion',
      type: 'general',
      participants: ['user1', 'user2', 'user3'],
      unreadCount: 0
    },
    {
      id: 'turkey-earthquake',
      name: 'Turkey Earthquake Response',
      type: 'crisis',
      participants: ['user1', 'user2', 'user4', 'user5'],
      unreadCount: 3
    },
    {
      id: 'medical-team',
      name: 'Medical Response Team',
      type: 'general',
      participants: ['user2', 'user3'],
      unreadCount: 1
    },
    {
      id: 'logistics',
      name: 'Logistics Coordination',
      type: 'general',
      participants: ['user1', 'user4'],
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user2',
      senderName: 'Dr. Sarah Johnson',
      content: 'Medical supplies have arrived at the distribution center. We need volunteers to help with sorting.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text',
      channelId: 'turkey-earthquake'
    },
    {
      id: '2',
      senderId: 'user3',
      senderName: 'Mike Chen',
      content: 'I can help with the sorting. What time should I be there?',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'text',
      channelId: 'turkey-earthquake'
    },
    {
      id: '3',
      senderId: 'user1',
      senderName: 'Emma Rodriguez',
      content: 'Great! We start at 9 AM. Please bring work gloves if you have them.',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: 'text',
      channelId: 'turkey-earthquake'
    },
    {
      id: '4',
      senderId: 'user4',
      senderName: 'James Wilson',
      content: 'Updated inventory spreadsheet attached. Please review the current stock levels.',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: 'file',
      channelId: 'logistics'
    }
  ]);

  const activeChannelMessages = messages.filter(m => m.channelId === activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannelMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      channelId: activeChannel
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'crisis': return '🚨';
      case 'general': return '💬';
      case 'direct': return '👤';
      default: return '📢';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Communications</h3>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {channels
              .filter(channel => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                    activeChannel === channel.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getChannelIcon(channel.type)}</span>
                      <div>
                        <div className="font-medium text-sm">{channel.name}</div>
                        <div className="text-xs text-gray-500">
                          {channel.participants.length} participants
                        </div>
                      </div>
                    </div>
                    {channel.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Call</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <Video className="h-4 w-4" />
              <span className="text-sm">Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                {getChannelIcon(channels.find(c => c.id === activeChannel)?.type || 'general')}
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {channels.find(c => c.id === activeChannel)?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {channels.find(c => c.id === activeChannel)?.participants.length} participants
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChannelMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                msg.senderId === user.id
                  ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                  : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
              } p-3`}>
                {msg.senderId !== user.id && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {msg.senderName}
                  </div>
                )}
                <div className="text-sm">{msg.content}</div>
                <div className={`text-xs mt-1 ${
                  msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900 rounded">
                <Smile className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}