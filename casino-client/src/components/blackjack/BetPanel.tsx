import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BetPanelProps } from '@/interfaces/blackjack/BetPanelProps.interface';
import dynamic from 'next/dynamic';

const BetPanelComponent = dynamic(() => Promise.resolve(BetPanelInner), {
  ssr: false
});

function BetPanelInner({ 
  onPlaceBet, 
  balance, 
  isGameStarted,
  currentBet,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onDeposit,
  canDouble,
  canSplit,
  isGameOver,
  isRegistered,
  casinoBalance,
  playerTotal,
  splitTotal,
  isSplit
}: BetPanelProps) {
  const [betAmount, setBetAmount] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0 && amount <= casinoBalance) {
      onPlaceBet(amount);
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0 && amount <= balance) {
      onDeposit(amount);
    }
  };

  const handleDouble = () => {
    if (currentBet && (currentBet * 2 <= balance) && onDouble) {
      onDouble();
    }
  };

  return (
    <div className="w-80 bg-gray-900 p-6 rounded-lg shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Your Casino Balance</h2>
        <p className="text-2xl font-bold text-emerald-400">
          {casinoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XTZ
        </p>
      </div>
      
      {!isGameStarted ? (
        <div className="space-y-4">
          {!isRegistered ? (
            <div className="text-red-500 text-center">
              Please register first to play
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Place your bet
                </label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  min="0"
                  max={casinoBalance}
                  step="0.01"
                  className="w-full bg-gray-800 text-white border-gray-700"
                  placeholder="Enter bet amount"
                />
              </div>
              <Button 
                onClick={handlePlaceBet}
                disabled={!betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > casinoBalance}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black"
              >
                Place Bet
              </Button>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit funds
                </label>
                <Input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  max={balance}
                  step="0.01"
                  className="w-full bg-gray-800 text-white border-gray-700"
                  placeholder="Enter deposit amount"
                />
              </div>
              <Button 
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > balance}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black"
              >
                Deposit
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-white text-center mb-4">
            <p className="text-lg">Current Bet:</p>
            <p className="text-2xl font-bold text-emerald-400">
              {currentBet?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} XTZ
            </p>
          </div>
          
          {isGameStarted && !isGameOver && (
            <div className="flex flex-col gap-4">
              {isSplit ? (
                <>
                  <Button 
                    onClick={() => onHit(false)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    //disabled={}
                  >
                    Hit Main Hand
                  </Button>
                  <Button 
                    onClick={() => onHit(true)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    //disabled={}
                  >
                    Hit Split Hand
                  </Button>
                  <Button 
                    onClick={onStand}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Stand (Both Hands)
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => onHit(false)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hit
                  </Button>
                  <Button 
                    onClick={onStand}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Stand
                  </Button>
                  <Button 
                    className={`w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed
                      ${canDouble && !isGameOver 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-black' 
                        : 'bg-emerald-500 text-black opacity-50'}`}
                    onClick={handleDouble}
                    disabled={!canDouble || isGameOver}
                  >
                    Double (+{currentBet ? (currentBet).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) : "0.00"} XTZ)
                </Button>
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onSplit}
                  disabled={!canSplit || isGameOver}
                >
                  Split
                </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function BetPanel(props: BetPanelProps) {
  return <BetPanelComponent {...props} />;
}