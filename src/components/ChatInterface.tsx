import { useState } from 'react';
import { Globe, Send, MoreVertical, Mic, Paperclip, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  originalLang?: string;
  translatedFrom?: string;
}

export function ChatInterface() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'assistant',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'I need help with my recent order',
      sender: 'user',
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'I\'d be happy to help you with that! Could you please provide your order number?',
      sender: 'assistant',
      timestamp: '10:31 AM',
    },
    {
      id: '4',
      text: 'Yes, it\'s #ORD-12345',
      sender: 'user',
      timestamp: '10:32 AM',
    },
    {
      id: '5',
      text: 'Thank you! I found your order. It was shipped yesterday and should arrive within 2-3 business days. You can track it using the tracking number sent to your email.',
      sender: 'assistant',
      timestamp: '10:32 AM',
      translatedFrom: 'English',
    },
  ]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand your question. Let me help you with that right away!',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        translatedFrom: selectedLanguage !== 'en' ? 'English' : undefined,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-full flex items-center justify-center">
                <span className="text-white">AI</span>
              </div>
              <div>
                <h3 className="text-gray-900">LinguaConnect Support</h3>
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online • Typing...</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{currentLanguage.flag}</span>
                    <span>{currentLanguage.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {languages.map(lang => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className="flex items-center gap-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {selectedLanguage === lang.code && (
                        <span className="ml-auto text-[#007BFF]">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F6FA]">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-[#007BFF] text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.translatedFrom && (
                      <p className="text-gray-400 mt-1">
                        Translated from {message.translatedFrom}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 px-1 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-gray-500">{message.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Globe className="w-3 h-3 text-[#007BFF]" />
              <span className="text-[#007BFF]">Powered by Lingo CLI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Type your message in ${currentLanguage.name}...`}
              className="flex-1 border-gray-200 focus-visible:ring-[#007BFF]"
            />
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Conversation Info */}
      <div className="w-80 border-l border-gray-200 bg-white p-6">
        <h3 className="text-gray-900 mb-4">Conversation Details</h3>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-gray-100">
            <p className="text-gray-600 mb-1">Active Language</p>
            <div className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span className="text-gray-900">{currentLanguage.name}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-gray-100">
            <p className="text-gray-600 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-900">Active</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-gray-100">
            <p className="text-gray-600 mb-1">Messages</p>
            <span className="text-gray-900">{messages.length}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Share Conversation
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                End Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
