import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface DealerBubbleProps {
  message: string | null;
  isLoading: boolean;
  muted: boolean;
  onToggleMute: () => void;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}</span>;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function DealerBubble({ message, isLoading, muted, onToggleMute }: DealerBubbleProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Mute button */}
      <button
        onClick={onToggleMute}
        className="self-end text-gray-400 hover:text-white transition-colors mb-1"
        title={muted ? 'Unmute dealer' : 'Mute dealer'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Bubble */}
      {(message || isLoading) && (
        <div className="relative">
          <div className="bg-gray-900/90 border border-emerald-500/40 text-emerald-300 text-sm px-4 py-2 rounded-2xl rounded-tl-none shadow-lg shadow-emerald-900/30 backdrop-blur-sm max-w-[220px]">
            {isLoading && !message ? (
              <TypingDots />
            ) : (
              <TypewriterText key={message!} text={message!} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
