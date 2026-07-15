import { CardPicked, Rank, Suit } from "@/interfaces/blackjack/CardProps.interface";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

export const getCardImagePath = (value: number): string => {
  const suits = ['pique', 'coeur', 'carreau', 'trefle'];
  const ranks = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'V', 'D', 'R'];

  const suitIndex = Math.floor(value / 13);
  const rankIndex = value % 13;

  return `/${ranks[rankIndex]}-${suits[suitIndex]}.png`;
};
