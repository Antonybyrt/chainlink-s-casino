export interface BetPanelProps {
    onPlaceBet: (amount: number) => void;
    onDeposit: (amount: number) => void;
    balance: number;
    isGameStarted: boolean;
    currentBet: number | null;
    onHit: (splitHand?: boolean) => void;
    onStand: () => void;
    onDouble: () => void;
    onSplit: () => void;
    canDouble: boolean;
    canSplit: boolean;
    isGameOver: boolean;
    isRegistered: boolean;
    casinoBalance: number;
    playerTotal: number;
    splitTotal: number;
    isSplit: boolean;
}