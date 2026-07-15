import { CardPicked, Rank, Suit } from "@/interfaces/blackjack/CardProps.interface";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCardValue(card: number): number {
  const rank = card % 13;
  if (rank === 0) {
      return 11;
  } else if (rank >= 10) {
      return 10;
  } else {
      return rank + 1;
  }
}

export const getCardDisplay = (value: number): CardPicked => {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const suitIndex = Math.floor(value / 13);
  const rankIndex = value % 13;

  return { 
    suit: suits[suitIndex], 
    rank: ranks[rankIndex], 
    hidden: false 
  };
};

export const cardExists = (card: number, cards: number[]): boolean => {
  return cards.includes(card);
};


export const fetchCardDealtEvents = async (
  contract: ethers.Contract,
  blockNumber: number,
  setPlayerCards: (cards: React.SetStateAction<number[]>) => void,
  setDealerCards: (cards: React.SetStateAction<number[]>) => void,
  setGameId: (id: React.SetStateAction<number | null>) => void,
  setGameStarted: (started: boolean) => void,
  isHitAction: boolean = false,
  setSplitCards: (cards: React.SetStateAction<number[]>) => void
): Promise<void> => {
  try {
    const events = await contract.queryFilter(
      contract.filters.CardDealt(),
      blockNumber,
      blockNumber
    );

    if (events.length > 0) {
      
      if (isHitAction) {
        const lastEvent = events[events.length - 1];
        const currentGameId = lastEvent.args![0];

        const relevantEvents = events.filter(event => event.args![0].toString() === currentGameId.toString());

        console.log("EVENT", relevantEvents)

        relevantEvents.forEach((event) => {
          const gameId = event.args![0];
          const receiver = event.args![1];
          const card = event.args![2];
          const splitHand = event.args![3]
          
          setGameId(gameId);
          
          if (receiver === "0x0000000000000000000000000000000000000000") {
            setDealerCards(prev => [...prev, Number(card)]);
          } else if (receiver != "0x0000000000000000000000000000000000000000" && splitHand === false) {
            console.log("main card")
            setPlayerCards(prev => [...prev, Number(card)]);
          } else if (receiver != "0x0000000000000000000000000000000000000000" && splitHand === true) {
            console.log("split card")
            setSplitCards(prev => [...prev, Number(card)]);
          }
        });
      } else {

        const gameId = events[0].args![0];
        const relevantEvents = events.filter(event => event.args![0].toString() === gameId.toString());

        console.log("EVENT1", relevantEvents)
        
        relevantEvents.forEach((event) => {
          const receiver = event.args![1];
          const card = event.args![2];
          
          setGameId(event.args![0]);
          
          if (receiver === "0x0000000000000000000000000000000000000000") {
            setDealerCards(prev => [...prev, Number(card)]);
          } else {
            setPlayerCards(prev => [...prev, Number(card)]);
          }
        });
      }
      
      setGameStarted(true);
    } else {
      console.log("No event CardDealt found");
    }
  } catch (error) {
    console.error("Erreor while getting event CardDealt:", error);
  }
};

export const fetchDealerActionEvents = async (contract: ethers.Contract, blockNumber: number, setIsGameOver: (value: boolean) => void) => {
    try {
        const events = await contract.queryFilter(
            contract.filters.DealerAction(),
            blockNumber,
            blockNumber
        );

        if (events.length > 0) {
            const lastEvent = events[events.length - 1];
            if (lastEvent.args && lastEvent.args.dealerTotal !== undefined) {
                const dealerTotal = Number(lastEvent.args.dealerTotal);
                console.log("Dealer total:", dealerTotal);
                setIsGameOver(true);
            }
        }
    } catch (error) {
        console.error("Error fetching DealerAction events:", error);
    }
};

export const fetchGameResolvedEvents = async (contract: ethers.Contract, blockNumber: number, setGameResult: (value: {outcome: "Win" | "Push" | "Lost" | "Split", winPercentage: number, totalPayout: number} | null) => void, setIsGameOver: (value: boolean) => void) => {
    try {
        const events = await contract.queryFilter(
            contract.filters.GameResolved(),
            blockNumber,
            blockNumber
        );

        if (events.length > 0) {
            const lastEvent = events[events.length - 1];
            if (lastEvent.args && 
                lastEvent.args.outcome !== undefined && 
                lastEvent.args.winPercentage !== undefined && 
                lastEvent.args.totalPayout !== undefined) {
                
                const outcomeValue = Number(lastEvent.args.outcome);
                const outcomeMap = ["Lost", "Push", "Win", "Split"] as const;
                const outcome = outcomeMap[outcomeValue] as "Win" | "Push" | "Lost" | "Split";
                
                const winPercentage = Number(lastEvent.args.winPercentage);
                const totalPayout = Number(lastEvent.args.totalPayout);
                
                setGameResult({ outcome, winPercentage, totalPayout });
                setIsGameOver(true);
            }
        }
    } catch (error) {
        console.error("Error fetching GameResolved events:", error);
    }
};

export const getCardImagePath = (value: number): string => {
  const suits = ['pique', 'coeur', 'carreau', 'trefle'];
  const ranks = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'V', 'D', 'R'];
  
  const suitIndex = Math.floor(value / 13);
  const rankIndex = value % 13;

  return `/${ranks[rankIndex]}-${suits[suitIndex]}.png`;
};