import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (amount: number) => void;
  balance: number;
  isPending: boolean;
}

const RegisterModalComponent = dynamic(() => Promise.resolve(RegisterModalInner), {
  ssr: false
});

// Composant interne
function RegisterModalInner({ isOpen, onClose, onRegister, balance, isPending }: RegisterModalProps) {
  const [amount, setAmount] = useState<string>('');

  const handleRegister = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && numAmount <= balance) {
      onRegister(numAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="text-emerald-400">Register to Play Blackjack</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount you want to register with. This will be your initial balance.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-emerald-400">
              Registration Amount (XTZ)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 text-white border-emerald-500/30 focus:border-emerald-500"
              placeholder="10"
              min="0.01"
              max={balance}
              step="0.01"
            />
          </div>
          <div className="text-sm text-emerald-400">
            Available Balance: {balance.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} XTZ
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-white border-emerald-500/30 hover:bg-emerald-500/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
            className="bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            {isPending ? 'Processing...' : 'Register'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RegisterModal(props: RegisterModalProps) {
  return <RegisterModalComponent {...props} />;
} 