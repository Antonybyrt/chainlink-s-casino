import { useState, useEffect, useRef } from 'react';
import { RegisterModal } from '@/components/blackjack/RegisterModal';
import { useConnection, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { useBlackjack } from '@/contracts/useBlackjack';
import dynamic from 'next/dynamic';
import { getCardValue, getCardDisplay, getCardImagePath } from '@/lib/utils';
import { ErrorService } from '@/service/error.service';
import { GameOverModal } from '@/components/blackjack/GameOverModal';
import { BlackjackHeader } from '@/components/blackjack/BlackjackHeader';
import { ChatMessage, speak, stopSpeech } from '@/components/blackjack/DealerChat';
import { DealerBubble } from '@/components/blackjack/DealerBubble';
import { ActionBar } from '@/components/blackjack/ActionBar';
import Image from 'next/image';

const BlackjackGame = dynamic(() => Promise.resolve(BlackjackComponent), {
  ssr: false
});

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

function BlackjackComponent() {
  const { address } = useConnection();
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
  });
  const {
    isPending,
    isWaitingForCards,
    newGame,
    deposit,
    register,
    cashOut,
    hit,
    double,
    stand,
    split,
    gameId,
    playerCards,
    dealerCards,
    isRegistered,
    casinoBalance,
    gameStarted,
    currentBet: hookCurrentBet,
    resetGame,
    isGameOver,
    gameResult,
    splitCards,
    isSplit
  } = useBlackjack();

  const [balance, setBalance] = useState(balanceData ? Number(formatUnits(balanceData.value, balanceData.decimals)) : 0);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBuyChipsModalOpen, setIsBuyChipsModalOpen] = useState(false);
  const [pendingBet, setPendingBet] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [splitTotal, setSplitTotal] = useState(0);
  const [localPlayerCards, setLocalPlayerCards] = useState<number[]>([]);
  const [localSplitCards, setLocalSplitCards] = useState<number[]>([]);

  // — Dealer chat state —
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [isDealerLoading, setIsDealerLoading] = useState(false);
  const [muted, setMuted]                 = useState(false);
  const pendingAction = useRef<'new_game' | 'hit' | 'double' | 'stand' | null>(null);
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

  // Stop speech on unmount
  useEffect(() => () => stopSpeech(), []);

  const toggleMute = () => {
    if (!muted) stopSpeech();
    setMuted(m => !m);
  };

  useEffect(() => {
    if (balanceData) {
      setBalance(Number(formatUnits(balanceData.value, balanceData.decimals)));
    }
  }, [balanceData]);

  useEffect(() => {
    console.log("Player cards updated:", playerCards);
    setLocalPlayerCards(playerCards);
    setPlayerTotal(calculateTotal(playerCards));
  }, [playerCards]);

  useEffect(() => {
    console.log("Split cards updated:", splitCards);
    setLocalSplitCards(splitCards);
    if (isSplit) {
      setSplitTotal(calculateTotal(splitCards));
    }
  }, [splitCards, isSplit]);

  // Trigger dealer comment after card deal (new_game / hit / double)
  useEffect(() => {
    if (playerCards.length === 0) return;
    const action = pendingAction.current;
    if (action === 'new_game' || action === 'hit' || action === 'double') {
      pendingAction.current = null;
      sendToDealerChat(action, { player: playerCards, dealer: dealerCards });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCards]);

  // Trigger dealer comment after stand (game resolved)
  useEffect(() => {
    if (!gameResult) return;
    if (pendingAction.current === 'stand') {
      pendingAction.current = null;
      sendToDealerChat('stand', { player: playerCards, dealer: dealerCards }, gameResult.outcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameResult]);


  const calculateTotal = (cards: number[]): number => {
    let sum = 0;
    let aces = 0;
    
    for (let i = 0; i < cards.length; i++) {
      const value = getCardValue(cards[i]);
      sum += value;
      if (value === 11) {
        aces++;
      }
    }
    
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    
    return sum;
  };

  const handleRegister = async (amount: number) => {
    try {
      await register(amount);
      setBalance(balance - amount);
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handlePlaceBet = async (amount: number) => {
    try {
      pendingAction.current = 'new_game';
      await newGame(amount);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleHit = async (splitHand: boolean = false) => {
    if (!gameId) {
      console.error('No game ID available for hit action');
      return;
    }
    
    try {
      pendingAction.current = 'hit';
      await hit(gameId, splitHand);
    } catch (error) {
      console.error('Error hitting:', error);
      ErrorService.mixinMessage("Error when hitting a new card", "error");
    }
  };

  const handleStand = async () => {
    if (!gameId) {
      console.error('No game ID available for stand action');
      return;
    }

    try {
      pendingAction.current = 'stand';
      await stand(gameId);
    } catch(err) {
      console.error("Error Stand:", err)
      ErrorService.mixinMessage("Error when Standing", "error");
    }
  };

  const handleDouble = async () => {
    if (!gameId) {
      console.error('No game ID available for double action');
      return;
    }

    if (hookCurrentBet && casinoBalance >= hookCurrentBet) {
      try {
        pendingAction.current = 'double';
        await double(gameId);
      } catch (err) {
        console.error("Error Double:", err)
        ErrorService.mixinMessage("Error when Doubling", "error");
      }
    } else {
      ErrorService.mixinMessage("You don't have enough funds to double", "error");
    }
  };

  const handleSplit = async () => {
    if (!gameId) {
      console.error('No game ID available for split action');
      return;
    }

    try {
      await split(gameId);
    } catch (err) {
      console.error("Error Split:", err)
      ErrorService.mixinMessage("Error when Splitting", "error");
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      await deposit(amount);
      setBalance(balance - amount); // ETH spent to mint CHIP; refreshed by useBalance anyway
      setIsBuyChipsModalOpen(false);
    } catch (error) {
      console.error('Error depositing:', error);
      ErrorService.mixinMessage("Error while depositing funds", "error");
    }
  };

  // ─── Dealer AI ───────────────────────────────────────────────────────────

  const calcTotal = (cards: number[]): number => {
    let sum = 0; let aces = 0;
    for (const c of cards) {
      const v = getCardValue(c); sum += v; if (v === 11) aces++;
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; }
    return sum;
  };

  const sendToDealerChat = async (
    action: 'new_game' | 'hit' | 'double' | 'stand' | 'chat',
    currentCards: { player: number[]; dealer: number[] },
    outcome?: 'Win' | 'Lost' | 'Push' | 'Split',
    playerMessage?: string
  ) => {
    const current = messagesRef.current;
    const outgoing: ChatMessage[] = playerMessage
      ? [...current, { role: 'user' as const, content: playerMessage }]
      : current;

    if (playerMessage) setMessages(outgoing);
    setIsDealerLoading(true);

    const dealerCard = currentCards.dealer.length > 0
      ? (() => { const d = getCardDisplay(currentCards.dealer[0]); return `${d.rank}${d.suit}`; })()
      : 'unknown';

    const gameContext = {
      action,
      playerTotal: calcTotal(currentCards.player),
      dealerVisibleCard: dealerCard,
      playerCards: currentCards.player.map(c => {
        const d = getCardDisplay(c); return `${d.rank}${d.suit}`;
      }),
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

  const handlePlayerChat = (content: string) => {
    sendToDealerChat('chat', { player: playerCards, dealer: dealerCards }, undefined, content);
  };

  const dealerTotal = calculateTotal(dealerCards);
  const lastDealerMessage = messages.filter(m => m.role === 'assistant').at(-1)?.content ?? null;

  const canHit    = gameStarted && !isGameOver && !isWaitingForCards;
  const canStand  = gameStarted && !isGameOver && !isWaitingForCards;
  const canDeal   = !gameStarted && isRegistered && !isWaitingForCards;
  const canDouble = !isWaitingForCards && hookCurrentBet !== null && casinoBalance >= hookCurrentBet && playerCards.length === 2;
  const canSplit  = !isWaitingForCards && playerCards.length === 2 && (playerCards[0] % 13) === (playerCards[1] % 13);

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col pb-[88px]">
      <BlackjackHeader
        isRegistered={isRegistered}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        casinoBalance={casinoBalance}
        onCashOut={() => {
          if (casinoBalance > 0) cashOut(casinoBalance);
        }}
        onBuyChipsClick={() => setIsBuyChipsModalOpen(true)}
      />

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
              <path id="b-arc1" d="M 50,265 Q 400,340 750,265" />
              <path id="b-arc2" d="M 100,292 Q 400,360 700,292" />
              <path id="b-arc3" d="M 138,316 Q 400,378 662,316" />
            </defs>
            <text fill="rgba(52,211,153,0.65)" fontSize="22" fontWeight="bold" letterSpacing="5" fontFamily="Georgia, serif">
              <textPath href="#b-arc1" startOffset="50%" textAnchor="middle">♠  BLACKJACK PAYS 3 TO 2  ♠</textPath>
            </text>
            <text fill="rgba(52,211,153,0.42)" fontSize="15" letterSpacing="4" fontFamily="Georgia, serif">
              <textPath href="#b-arc2" startOffset="50%" textAnchor="middle">INSURANCE PAYS 2 TO 1</textPath>
            </text>
            <text fill="rgba(52,211,153,0.28)" fontSize="12" letterSpacing="2" fontFamily="Georgia, serif">
              <textPath href="#b-arc3" startOffset="50%" textAnchor="middle">DEALER MUST DRAW TO 16 AND STAND ON ALL 17s</textPath>
            </text>
          </svg>

          <GameOverModal isGameOver={isGameOver} gameResult={gameResult} onReset={resetGame} />

          {/* Waiting for Chainlink VRF fulfillment (async shuffle) */}
          {isWaitingForCards && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-[50px]">
              <div className="h-12 w-12 mb-4 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <p className="text-emerald-200 font-mono text-lg tracking-wide">Shuffling the deck…</p>
              <p className="text-emerald-500/70 font-mono text-xs mt-1">Waiting for Chainlink VRF randomness</p>
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
          {(pendingBet > 0 || (gameStarted && hookCurrentBet)) && (() => {
            const display = pendingBet > 0 ? pendingBet : (hookCurrentBet ?? 0);
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
                <p className="text-yellow-300/70 font-mono text-xs font-bold">{display} CHIP</p>
              </div>
            );
          })()}

          {/* Player zone */}
          {!isSplit ? (
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
                {localPlayerCards.map((card, index) => (
                  <div key={index} className="w-24 h-36 rounded-lg shadow-lg bg-white overflow-hidden">
                    <Image src={getCardImagePath(card)} alt="Card" width={96} height={144} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="absolute bottom-[120px] left-16 flex flex-col items-center">
                <div className="flex flex-col items-center gap-1 mb-3">
                  <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Main Hand</p>
                  <div className={`px-4 py-1 rounded-xl border font-mono font-bold text-2xl shadow-lg
                    ${playerTotal > 21 ? 'bg-red-950/80 border-red-500/60 text-red-300' : 'bg-black/60 border-emerald-500/40 text-emerald-300'}`}>
                    {playerTotal}
                  </div>
                </div>
                <div className="flex space-x-4">
                  {localPlayerCards.map((card, index) => (
                    <div key={index} className="w-24 h-36 rounded-lg shadow-lg bg-white overflow-hidden">
                      <Image src={getCardImagePath(card)} alt="Card" width={96} height={144} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-[120px] right-16 flex flex-col items-center">
                <div className="flex flex-col items-center gap-1 mb-3">
                  <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Split Hand</p>
                  <div className={`px-4 py-1 rounded-xl border font-mono font-bold text-2xl shadow-lg
                    ${splitTotal > 21 ? 'bg-red-950/80 border-red-500/60 text-red-300' : 'bg-black/60 border-emerald-500/40 text-emerald-300'}`}>
                    {splitTotal}
                  </div>
                </div>
                <div className="flex space-x-4">
                  {localSplitCards.map((card, index) => (
                    <div key={`split-${index}`} className="w-24 h-36 rounded-lg shadow-lg bg-white overflow-hidden">
                      <Image src={getCardImagePath(card)} alt="Card" width={96} height={144} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ActionBar
        casinoBalance={casinoBalance}
        currentBet={hookCurrentBet}
        isSplit={isSplit}
        onHit={handleHit}
        onStand={handleStand}
        onDouble={handleDouble}
        onSplit={handleSplit}
        onDeal={handlePlaceBet}
        canHit={canHit}
        canStand={canStand}
        canDouble={canDouble}
        canSplit={canSplit}
        canDeal={canDeal}
        onSendMessage={handlePlayerChat}
        isChatDisabled={isDealerLoading}
        onBetChange={setPendingBet}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
        balance={balance}
        isPending={isPending}
      />

      <RegisterModal
        isOpen={isBuyChipsModalOpen}
        onClose={() => setIsBuyChipsModalOpen(false)}
        onRegister={handleDeposit}
        balance={balance}
        isPending={isPending}
        title="Buy chips"
        description="Deposit ETH to mint more CHIP to your wallet, converted at the current ETH/USD price."
        submitLabel="Buy chips"
      />
    </div>
  );
}

export default BlackjackGame;