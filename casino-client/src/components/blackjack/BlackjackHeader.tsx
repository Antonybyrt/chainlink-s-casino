import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/lib/client';

interface BlackjackHeaderProps {
  isRegistered: boolean;
  onRegisterClick: () => void;
}

export function BlackjackHeader({ isRegistered, onRegisterClick }: BlackjackHeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Blackjack</h1>
        </div>

        <div className="flex items-center gap-4">
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
          <ConnectButton client={client} />
        </div>
      </div>
    </header>
  );
} 