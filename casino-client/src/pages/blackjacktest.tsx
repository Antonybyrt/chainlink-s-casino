import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { ChatMessage, speak, stopSpeech } from '@/components/blackjack/DealerChat';
import { DealerBubble } from '@/components/blackjack/DealerBubble';
import { ActionBar } from '@/components/blackjack/ActionBar';
import { getCardValue, getCardDisplay, getCardImagePath } from '@/lib/utils';
import Image from 'next/image';

const BlackjackDemo = dynamic(() => Promise.resolve(BlackjackDemoComponent), { ssr: false });

// ─── Bet chip display ─────────────────────────────────────────────────────────

const CHIP_DISPLAY = [
  { value: 500, color: 'bg-purple-700 border-purple-400' },
  { value: 100, color: 'bg-red-700 border-red-400'       },
  { value: 50,  color: 'bg-blue-700 border-blue-400'     },
  { value: 25,  color: 'bg-green-700 border-green-400'   },
  { value: 10,  color: 'bg-orange-700 border-orange-400' },
  { value: 1,   color: 'bg-gray-600 border-gray-400'     },
];

function decomposeChips(amount: number) {
  const chips: Array<{ value: number; color: string }> = [];
  let remaining = amount;
  for (const chip of CHIP_DISPLAY) {
    while (remaining >= chip.value) { chips.push(chip); remaining -= chip.value; }
  }
  return chips;
}

// ─── Deck utils ──────────────────────────────────────────────────────────────

const createShuffledDeck = (): number[] => {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const calcTotal = (cards: number[]): number => {
  let sum = 0;
  let aces = 0;
  for (const c of cards) {
    const v = getCardValue(c);
    sum += v;
    if (v === 11) aces++;
  }
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
};

const cardName = (card: number): string => {
  const d = getCardDisplay(card);
  return `${d.rank}${d.suit}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

function BlackjackDemoComponent() {
  const [deck, setDeck]               = useState<number[]>([]);
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [dealerCards, setDealerCards] = useState<number[]>([]);
  const [balance, setBalance]         = useState(1000);
  const [currentBet, setCurrentBet]   = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver]   = useState(false);
  const [result, setResult]           = useState<'Win' | 'Lost' | 'Push' | null>(null);

  const [pendingBet, setPendingBet]       = useState(0);

  // Dealer chat
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [isDealerLoading, setIsDealerLoading] = useState(false);
  const [muted, setMuted]                 = useState(false);
  const messagesRef   = useRef<ChatMessage[]>([]);
  const prevLengthRef = useRef(0);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // TTS — speak new dealer messages
  useEffect(() => {
    if (muted) return;
    if (messages.length <= prevLengthRef.current) return;
    const latest = messages[messages.length - 1];
    if (latest?.role === 'assistant' && latest.content) speak(latest.content);
    prevLengthRef.current = messages.length;
  }, [messages, muted]);

  // Reset TTS counter when chat clears
  useEffect(() => {
    if (messages.length === 0) prevLengthRef.current = 0;
  }, [messages.length]);

  // Stop speech on unmount
  useEffect(() => () => stopSpeech(), []);

  const toggleMute = () => {
    if (!muted) stopSpeech();
    setMuted(m => !m);
  };

  // ─── AI helper ─────────────────────────────────────────────────────────────

  const sendToDealerChat = async (
    action: 'new_game' | 'hit' | 'double' | 'stand' | 'chat',
    ctx: { player: number[]; dealer: number[] },
    outcome?: 'Win' | 'Lost' | 'Push' | 'Split',
    playerMessage?: string
  ) => {
    const current = messagesRef.current;
    const outgoing: ChatMessage[] = playerMessage
      ? [...current, { role: 'user' as const, content: playerMessage }]
      : current;

    if (playerMessage) setMessages(outgoing);
    setIsDealerLoading(true);

    const gameContext = {
      action,
      playerTotal: calcTotal(ctx.player),
      dealerVisibleCard: ctx.dealer.length > 0 ? cardName(ctx.dealer[0]) : 'unknown',
      playerCards: ctx.player.map(cardName),
      ...(outcome ? { outcome } : {}),
    };

    try {
      const res = await fetch('/api/dealer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing, gameContext }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { reply: string };
      setMessages(prev => [...prev, { role: 'assistant' as const, content: data.reply }]);
    } catch (err) {
      console.error('Dealer chat error:', err);
    } finally {
      setIsDealerLoading(false);
    }
  };

  // ─── Game actions ───────────────────────────────────────────────────────────

  // Accepts amount from ActionBar chip selection
  const handlePlaceBet = (amount: number) => {
    if (!amount || amount <= 0 || amount > balance) return;

    const freshDeck = createShuffledDeck();
    const pCards = [freshDeck[0], freshDeck[2]];
    const dCards = [freshDeck[1], freshDeck[3]];
    const remaining = freshDeck.slice(4);

    setDeck(remaining);
    setPlayerCards(pCards);
    setDealerCards(dCards);
    setCurrentBet(amount);
    setBalance(b => b - amount);
    setGameStarted(true);
    setIsGameOver(false);
    setResult(null);
    setMessages([]);

    sendToDealerChat('new_game', { player: pCards, dealer: dCards });
  };

  const resolveGame = async (pCards: number[], dCards: number[], remainingDeck: number[]) => {
    let currentDeck = [...remainingDeck];
    let currentDealerCards = [...dCards];

    while (calcTotal(currentDealerCards) < 17) {
      const [card, ...rest] = currentDeck;
      currentDealerCards = [...currentDealerCards, card];
      currentDeck = rest;
    }

    setDealerCards(currentDealerCards);
    setDeck(currentDeck);

    const playerTotal = calcTotal(pCards);
    const dealerTotal = calcTotal(currentDealerCards);

    let outcome: 'Win' | 'Lost' | 'Push';
    if (playerTotal > 21)                                   outcome = 'Lost';
    else if (dealerTotal > 21 || playerTotal > dealerTotal) outcome = 'Win';
    else if (playerTotal === dealerTotal)                   outcome = 'Push';
    else                                                    outcome = 'Lost';

    setResult(outcome);
    setIsGameOver(true);

    if (outcome === 'Win')  setBalance(b => b + (currentBet ?? 0) * 2);
    if (outcome === 'Push') setBalance(b => b + (currentBet ?? 0));

    await sendToDealerChat('stand', { player: pCards, dealer: currentDealerCards }, outcome);
  };

  const handleHit = async () => {
    if (isGameOver) return;
    await sendToDealerChat('hit', { player: playerCards, dealer: dealerCards });
    const [newCard, ...rest] = deck;
    const newPlayerCards = [...playerCards, newCard];
    setDeck(rest);
    setPlayerCards(newPlayerCards);
    const total = calcTotal(newPlayerCards);
    if (total >= 21) {
      await resolveGame(newPlayerCards, dealerCards, rest);
    }
  };

  const handleStand = async () => {
    if (isGameOver) return;
    await resolveGame(playerCards, dealerCards, deck);
  };

  const handleReset = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGameStarted(false);
    setCurrentBet(null);
    setIsGameOver(false);
    setResult(null);
    setMessages([]);
  };


  const playerTotal = calcTotal(playerCards);
  const dealerTotal = calcTotal(dealerCards);
  const lastDealerMessage = messages.filter(m => m.role === 'assistant').at(-1)?.content ?? null;

  // Availability — Deal available before game or after game over (for restart)
  const canDeal   = !gameStarted || isGameOver;
  const canHit    = gameStarted && !isGameOver;
  const canStand  = gameStarted && !isGameOver;

  // Wrap onDeal to auto-reset when game is over before starting new round
  const handleDeal = (amount: number) => {
    if (isGameOver) handleReset();
    handlePlaceBet(amount);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col pb-[88px]">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm">
        <div className="px-8 py-4 flex items-center gap-4">
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Blackjack
            <span className="text-sm text-gray-400 font-normal ml-2">— Demo</span>
          </h1>
        </div>
      </header>

      {/* Wooden rim */}
      <div
        className="flex-1 relative m-4 rounded-[60px] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]"
        style={{ background: 'radial-gradient(ellipse at center, #8B5E3C 0%, #4a2e12 60%, #2a1a08 100%)' }}
      >
        {/* Green felt */}
        <div
          className="absolute inset-6 rounded-[50px] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
          style={{ background: 'radial-gradient(ellipse at center, #1a5c35 0%, #0d3d22 60%, #071f11 100%)' }}
        >
          {/* Curved table inscriptions */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none"
            viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <path id="t-arc1" d="M 50,265 Q 400,340 750,265" />
              <path id="t-arc2" d="M 100,292 Q 400,360 700,292" />
              <path id="t-arc3" d="M 138,316 Q 400,378 662,316" />
            </defs>
            <text fill="rgba(52,211,153,0.65)" fontSize="22" fontWeight="bold" letterSpacing="5" fontFamily="Georgia, serif">
              <textPath href="#t-arc1" startOffset="50%" textAnchor="middle">♠  BLACKJACK PAYS 3 TO 2  ♠</textPath>
            </text>
            <text fill="rgba(52,211,153,0.42)" fontSize="15" letterSpacing="4" fontFamily="Georgia, serif">
              <textPath href="#t-arc2" startOffset="50%" textAnchor="middle">INSURANCE PAYS 2 TO 1</textPath>
            </text>
            <text fill="rgba(52,211,153,0.28)" fontSize="12" letterSpacing="2" fontFamily="Georgia, serif">
              <textPath href="#t-arc3" startOffset="50%" textAnchor="middle">DEALER MUST DRAW TO 16 AND STAND ON ALL 17s</textPath>
            </text>
          </svg>

          {/* Game result overlay */}
          {isGameOver && result && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <p className={`text-7xl font-bold drop-shadow-2xl ${
                  result === 'Win'  ? 'text-emerald-400' :
                  result === 'Lost' ? 'text-red-400'     : 'text-yellow-400'
                }`}>
                  {result === 'Win' ? '✅ Win!' : result === 'Lost' ? '💔 Lost' : '⚖️ Push'}
                </p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-lg transition-all"
                >
                  New Game
                </button>
              </div>
            </div>
          )}

          {/* Dealer bubble — top-left */}
          <div className="absolute top-4 left-6 max-w-[200px]">
            <DealerBubble message={lastDealerMessage} isLoading={isDealerLoading} muted={muted} onToggleMute={toggleMute} />
          </div>

          {/* Dealer cards — top-center */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex flex-col items-center gap-1 mb-3">
              <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Dealer</p>
              <div className={`px-4 py-1 rounded-xl border font-mono font-bold text-2xl shadow-lg
                ${isGameOver && dealerTotal > 21
                  ? 'bg-red-950/80 border-red-500/60 text-red-300'
                  : 'bg-black/60 border-emerald-500/40 text-emerald-300'}`}>
                {isGameOver ? dealerTotal : '?'}
              </div>
            </div>
            <div className="flex space-x-4">
              {dealerCards.map((card, index) => (
                <div key={index} className={`w-24 h-36 rounded-lg shadow-lg overflow-hidden
                  ${index === 1 && !isGameOver ? 'bg-blue-600' : 'bg-white'}`}>
                  {(index === 0 || isGameOver)
                    ? <Image src={getCardImagePath(card)} alt="Card" width={96} height={144} className="w-full h-full object-contain" />
                    : <Image src="/dos-bleu.png" alt="Card Back" width={96} height={144} className="w-full h-full object-contain" />}
                </div>
              ))}
            </div>
          </div>

          {/* Bet chips on table */}
          {(pendingBet > 0 || (gameStarted && currentBet)) && (() => {
            const display = pendingBet > 0 ? pendingBet : (currentBet ?? 0);
            const chips = decomposeChips(display);
            const visible = chips.slice(0, 8);
            const overflow = chips.length - visible.length;
            return (
              <div className="absolute bottom-[290px] left-[62%] -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
                <p className="text-[9px] text-yellow-400/60 font-mono uppercase tracking-widest">Mise</p>
                <div className="flex items-end gap-1">
                  {visible.map((chip, i) => (
                    <div
                      key={i}
                      style={{ marginBottom: i % 2 === 0 ? 0 : 4 }}
                      className={`w-8 h-8 rounded-full border-2 ${chip.color} flex items-center justify-center text-[9px] font-bold text-white shadow-md`}
                    >
                      {chip.value}
                    </div>
                  ))}
                  {overflow > 0 && (
                    <span className="text-yellow-400/80 font-mono text-[9px] ml-1">+{overflow}</span>
                  )}
                </div>
                <p className="text-yellow-300/70 font-mono text-xs font-bold">{display} XTZ</p>
              </div>
            );
          })()}

          {/* Player cards — bottom-center */}
          <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex flex-col items-center gap-1 mb-3">
              <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Your Hand</p>
              <div className={`px-4 py-1 rounded-xl border font-mono font-bold text-2xl shadow-lg
                ${playerTotal > 21
                  ? 'bg-red-950/80 border-red-500/60 text-red-300'
                  : playerTotal === 21
                  ? 'bg-emerald-950/80 border-emerald-400/70 text-emerald-200'
                  : 'bg-black/60 border-emerald-500/40 text-emerald-300'}`}>
                {playerTotal}
              </div>
            </div>
            <div className="flex space-x-4">
              {playerCards.map((card, index) => (
                <div key={index} className="w-24 h-36 rounded-lg shadow-lg bg-white overflow-hidden">
                  <Image src={getCardImagePath(card)} alt="Card" width={96} height={144} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ActionBar
        casinoBalance={balance}
        currentBet={currentBet}
        isSplit={false}
        onHit={() => handleHit()}
        onStand={handleStand}
        onDouble={() => {}}
        onSplit={() => {}}
        onDeal={handleDeal}
        canHit={canHit}
        canStand={canStand}
        canDouble={false}
        canSplit={false}
        canDeal={canDeal}
        onSendMessage={content => sendToDealerChat('chat', { player: playerCards, dealer: dealerCards }, undefined, content)}
        isChatDisabled={isDealerLoading}
        onBetChange={setPendingBet}
      />
    </div>
  );
}

export default BlackjackDemo;
