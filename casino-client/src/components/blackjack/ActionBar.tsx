import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ActionBarProps {
  casinoBalance: number;
  currentBet: number | null;
  isSplit: boolean;

  onHit: (splitHand?: boolean) => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  onDeal: (amount: number) => void;

  canHit: boolean;
  canStand: boolean;
  canDouble: boolean;
  canSplit: boolean;
  canDeal: boolean;

  onSendMessage: (msg: string) => void;
  isChatDisabled: boolean;

  onBetChange?: (amount: number) => void;
}

const CHIPS = [
  { label: '1',   value: 1,   color: 'bg-gray-600 border-gray-400'     },
  { label: '10',  value: 10,  color: 'bg-orange-700 border-orange-400' },
  { label: '25',  value: 25,  color: 'bg-green-700 border-green-400'   },
  { label: '50',  value: 50,  color: 'bg-blue-700 border-blue-400'     },
  { label: '100', value: 100, color: 'bg-red-700 border-red-400'       },
  { label: '500', value: 500, color: 'bg-purple-700 border-purple-400' },
];

export function ActionBar({
  casinoBalance, currentBet, isSplit,
  onHit, onStand, onDouble, onSplit, onDeal,
  canHit, canStand, canDouble, canSplit, canDeal,
  onSendMessage, isChatDisabled,
  onBetChange,
}: ActionBarProps) {
  const [betAmount, setBetAmount] = useState(0);
  const [shaking, setShaking]     = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => { onBetChange?.(betAmount); }, [betAmount]);

  const shake = (id: string) => {
    setShaking(id);
    setTimeout(() => setShaking(null), 350);
  };

  const handleAction = (id: string, available: boolean, fn: () => void) => {
    if (!available) { shake(id); return; }
    fn();
  };

  const handleChip = (value: number) => {
    if (!canDeal) { shake(`chip-${value}`); return; }
    setBetAmount(v => v + value);
  };

  const handleDeal = () => {
    if (!canDeal || betAmount <= 0 || betAmount > casinoBalance) { shake('deal'); return; }
    onDeal(betAmount);
    setBetAmount(0);
  };

  const sendChat = () => {
    if (!chatInput.trim() || isChatDisabled) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  const dealAvailable = canDeal && betAmount > 0 && betAmount <= casinoBalance;

  const buttons = isSplit
    ? [
        { id: 'hit-main',  label: 'Hit Main',   emoji: '➕', fn: () => onHit(false), can: canHit   },
        { id: 'hit-split', label: 'Hit Split',  emoji: '➕', fn: () => onHit(true),  can: canHit   },
        { id: 'stand',     label: 'Stand Both', emoji: '✋', fn: onStand,             can: canStand },
      ]
    : [
        { id: 'deal',   label: 'Deal',   emoji: '🃏', fn: handleDeal,        can: dealAvailable },
        { id: 'hit',    label: 'Hit',    emoji: '➕', fn: () => onHit(false), can: canHit        },
        { id: 'stand',  label: 'Stand',  emoji: '✋', fn: onStand,            can: canStand      },
        { id: 'double', label: 'Double', emoji: '×2', fn: onDouble,           can: canDouble     },
        { id: 'split',  label: 'Split',  emoji: '↔',  fn: onSplit,            can: canSplit      },
      ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[88px]
      bg-gradient-to-t from-black/95 to-black/70
      border-t border-yellow-900/40 backdrop-blur-sm
      flex items-center justify-between px-8 gap-6">

      {/* Left — balance info */}
      <div className="flex gap-8 shrink-0">
        <div>
          <p className="text-[10px] text-yellow-600/70 font-mono uppercase tracking-widest">Balance</p>
          <p className="text-white font-mono text-lg font-bold">
            {casinoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CHIP
          </p>
        </div>
        <div>
          <p className="text-[10px] text-yellow-600/70 font-mono uppercase tracking-widest">Current Bet</p>
          <p className="text-white font-mono text-lg font-bold">
            {(currentBet ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CHIP
          </p>
        </div>
      </div>

      {/* Center — action buttons */}
      <div className="flex items-center gap-3">
        {buttons.map(({ id, label, emoji, fn, can }) => (
          <button
            key={id}
            onClick={() => handleAction(id, can, fn)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl
              font-mono text-xs font-bold transition-all min-w-[64px]
              ${shaking === id ? 'shake' : ''}
              ${can
                ? 'bg-gradient-to-b from-yellow-500/30 to-yellow-700/20 border border-yellow-500/50 text-yellow-200 hover:from-yellow-400/40 hover:border-yellow-400'
                : 'bg-gray-800/40 border border-gray-700/30 text-gray-600 cursor-not-allowed'
              }`}
          >
            <span className="text-lg leading-none mb-0.5">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Right — bet chips + chat */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {/* Chip row */}
        <div className="flex items-center gap-2">
          {canDeal && betAmount > 0 && (
            <span className="text-yellow-400 font-mono text-xs mr-1">{betAmount} XTZ</span>
          )}
          {CHIPS.map(({ label, value, color }) => (
            <button
              key={value}
              onClick={() => handleChip(value)}
              className={`w-10 h-10 rounded-full border-2 text-white text-xs font-bold
                transition-all ${shaking === `chip-${value}` ? 'shake' : ''}
                ${canDeal
                  ? `${color} hover:brightness-110`
                  : 'bg-gray-800 border-gray-700 opacity-30 cursor-not-allowed'}`}
            >
              {label}
            </button>
          ))}
          {canDeal && betAmount > 0 && (
            <button
              onClick={() => setBetAmount(0)}
              className="text-gray-500 hover:text-white text-xs ml-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Chat input */}
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            disabled={isChatDisabled}
            placeholder="Talk to the dealer..."
            className="bg-black/60 border border-gray-700/50 text-white text-xs rounded-xl px-3 py-1.5
              placeholder:text-gray-600 focus:outline-none focus:border-yellow-700/50 w-44"
          />
          <button
            onClick={sendChat}
            disabled={isChatDisabled || !chatInput.trim()}
            className="bg-yellow-700/40 hover:bg-yellow-600/50 disabled:opacity-30 text-yellow-200 rounded-xl px-2 py-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
