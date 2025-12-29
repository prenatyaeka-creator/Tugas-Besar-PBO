import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Badge } from './ui/badge';

interface Message {
  id: number;
  sender: string;
  initials: string;
  message: string;
  timestamp: string;
  color: string;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
}

export function Discussion() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  // Start with an empty discussion (no demo data)
  const [messages, setMessages] = useState<Message[]>([]);

  // Keep a simple default channel list (no demo unread counts)
  const channels: Channel[] = [
    { id: 'general', name: 'General', unread: 0 },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Anda',
        initials: 'AN',
        message: messageInput,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        color: '#E88C7D',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#355070] mb-2">Diskusi</h2>
        <p className="text-gray-600">Berkomunikasi dengan tim Anda secara real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#355070]">Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeChannel === channel.id
                      ? 'bg-[#355070] text-white'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span># {channel.name}</span>
                  {channel.unread > 0 && (
                    <Badge className="bg-[#E56B6F] hover:bg-[#E56B6F]">{channel.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-[#355070]"># {activeChannel}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center text-gray-500">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Belum ada pesan</p>
                    <p className="text-sm">Mulai percakapan pertama di channel ini ✨</p>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-white" style={{ backgroundColor: msg.color }}>
                      {msg.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#355070]">{msg.sender}</span>
                      <span className="text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#355070]">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#355070]">
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Ketik pesan..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#355070] hover:bg-[#355070]/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
