import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  isGameOver: boolean;
  gameResult: {outcome: "Win" | "Push" | "Lost" | "Split", winPercentage: number, totalPayout: number} | null;
  onReset: () => void;
}

export function GameOverModal({ isGameOver, gameResult, onReset }: GameOverModalProps) {
  if (!isGameOver || !gameResult) return null;

  const getResultMessage = () => {
    switch (gameResult.outcome) {
      case "Win":
        return `Win: ${gameResult.totalPayout / 10**18} XTZ (${gameResult.winPercentage}%)`;
      case "Push":
        return "Your bet has been returned";
      case "Lost":
        return "Better luck next time";
      case "Split":
        return `Split: ${gameResult.totalPayout / 10**18} XTZ (${gameResult.winPercentage}%)`;
      default:
        return null;
    }
  };

  const getResultIcon = () => {
    switch (gameResult.outcome) {
      case "Win":
        return "✅";
      case "Push":
        return "⚖️";
      case "Lost":
        return "💔";
      case "Split":
        return "⚖️"
      default:
        return "";
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="relative w-[450px] h-[300px]">
        <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-xs rounded-3xl shadow-2xl border-2 border-emerald-500/20" />

        <div className="relative flex flex-col items-center justify-center h-full p-6">
          <div className="text-6xl mb-4 animate-bounce">
            {getResultIcon()}
          </div>

          <h2 className="text-4xl font-bold text-emerald-400 mb-3 tracking-wider">
            {gameResult.outcome === "Win" ? "VICTORY" : 
             gameResult.outcome === "Push" ? "PUSH" : 
             gameResult.outcome === "Split" ? "SPLIT" : "DEFEAT"}
          </h2>

          <p className="text-xl text-emerald-300 mb-8 font-light">
            {getResultMessage()}
          </p>

          <Button 
            onClick={onReset}
            className="px-10 py-6 text-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl 
                     border-2 border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300
                     shadow-lg hover:shadow-xl"
          >
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
} 