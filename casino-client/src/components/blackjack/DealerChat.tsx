import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Volume2, VolumeX } from 'lucide-react';

const ROLE_USER      = 'user'      as const;
const ROLE_ASSISTANT = 'assistant' as const;

export interface ChatMessage {
  role: typeof ROLE_USER | typeof ROLE_ASSISTANT;
  content: string;
}

interface DealerChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

// ─── TTS queue ───────────────────────────────────────────────────────────────

let currentAudio: HTMLAudioElement | null = null;
const ttsQueue: string[] = [];
let queueRunning = false;

function speakBrowser(text: string): Promise<void> {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate  = 0.9;
    utterance.pitch = 0.7;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && /male|daniel|alex|fred|bruce|ralph/i.test(v.name)
    ) ?? voices.find(v => v.lang.startsWith('en')) ?? null;
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

// Play a single text via ElevenLabs (or fallback), returns when audio ends
async function playSingle(text: string): Promise<void> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    await new Promise<void>((resolve) => {
      const audio = new Audio(url);
      currentAudio = audio;
      audio.play();
      audio.onended  = () => { URL.revokeObjectURL(url); currentAudio = null; resolve(); };
      audio.onerror  = () => { URL.revokeObjectURL(url); currentAudio = null; resolve(); };
    });
  } catch {
    await speakBrowser(text);
  }
}

// Drain the queue one item at a time
async function drainQueue() {
  if (queueRunning) return;
  queueRunning = true;
  while (ttsQueue.length > 0) {
    const text = ttsQueue.shift()!;
    await playSingle(text);
  }
  queueRunning = false;
}

// Public: enqueue a message (never interrupts current speech)
export function speak(text: string) {
  ttsQueue.push(text);
  drainQueue();
}

export function stopSpeech() {
  ttsQueue.length = 0;           // clear pending
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  window.speechSynthesis?.cancel();
  queueRunning = false;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState(active ? '' : text);

  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [text, active]);

  return <span>{displayed}</span>;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DealerChat({ messages, isLoading, onSendMessage }: DealerChatProps) {
  const [input, setInput] = useState('');
  const [muted, setMuted] = useState(false);
  const bottomRef         = useRef<HTMLDivElement>(null);
  const prevLengthRef     = useRef(0);

  // Speak new dealer messages
  useEffect(() => {
    if (muted) return;
    if (messages.length <= prevLengthRef.current) return;
    const latest = messages[messages.length - 1];
    if (latest?.role === ROLE_ASSISTANT && latest.content) {
      speak(latest.content);
    }
    prevLengthRef.current = messages.length;
  }, [messages, muted]);

  // Reset counter when chat is cleared
  useEffect(() => {
    if (messages.length === 0) prevLengthRef.current = 0;
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Stop speech on unmount
  useEffect(() => () => stopSpeech(), []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
  };

  const toggleMute = () => {
    if (!muted) stopSpeech();
    setMuted(m => !m);
  };

  return (
    <div className="w-80 bg-gray-900 rounded-lg shadow-xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
        <span className="text-xl">🃏</span>
        <h2 className="text-white font-bold text-sm">Dealer</h2>
        <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full" />
        <button
          onClick={toggleMute}
          className="ml-auto text-gray-400 hover:text-white transition-colors"
          title={muted ? 'Unmute dealer' : 'Mute dealer'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-xs text-center mt-8">
            Place a bet and the dealer will speak...
          </p>
        )}
        {messages.map((msg, idx) => {
          const isDealer = msg.role === ROLE_ASSISTANT;
          const isLast   = idx === messages.length - 1;
          return (
            <div key={idx} className={`flex ${isDealer ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                  isDealer
                    ? 'bg-gray-800 text-emerald-300 rounded-tl-none'
                    : 'bg-emerald-700 text-white rounded-tr-none'
                }`}
              >
                {isDealer
                  ? <TypewriterText text={msg.content} active={isLast} />
                  : msg.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-tl-none">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-700 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          placeholder="Talk to the dealer..."
          className="bg-gray-800 text-white border-gray-700 text-sm placeholder:text-gray-500"
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 text-black px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
