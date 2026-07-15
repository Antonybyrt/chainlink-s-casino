import { useState } from 'react';
import { Send } from 'lucide-react';

interface PlayerChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function PlayerChatInput({ onSendMessage, isLoading }: PlayerChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
        placeholder="Talk to the dealer..."
        className="flex-1 bg-gray-900/80 border border-emerald-500/30 text-white text-sm rounded-xl px-3 py-2 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/70 backdrop-blur-sm"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black rounded-xl p-2 transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
