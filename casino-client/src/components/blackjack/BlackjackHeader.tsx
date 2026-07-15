import { Button } from '@/components/ui/button';
import { ConnectButton } from 'thirdweb/react';
import { sepolia } from 'thirdweb/chains';
import { client } from '@/lib/client';

interface BlackjackHeaderProps {
  isRegistered: boolean;
  onRegisterClick: () => void;
  casinoBalance: number;
  onCashOut: () => void;
}

export function BlackjackHeader({ isRegistered, onRegisterClick, casinoBalance, onCashOut }: BlackjackHeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Blackjack</h1>
          <span className="text-emerald-400 font-mono text-sm">
            {casinoBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} CHIP
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isRegistered && casinoBalance > 0 && (
            <Button
              onClick={onCashOut}
              variant="ghost"
              className="text-emerald-300 hover:bg-gray-800 border border-emerald-500/40"
            >
              Cash out
            </Button>
          )}
          {!isRegistered && (
            <Button
              onClick={onRegisterClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              Register
            </Button>
          )}
          {isRegistered && (
            <span className="text-emerald-400 font-medium">Registered ✓</span>
          )}
          <ConnectButton client={client} chain={sepolia} />
        </div>
      </div>
    </header>
  );
}
