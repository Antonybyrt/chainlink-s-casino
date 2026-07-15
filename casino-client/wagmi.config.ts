import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { type Abi } from 'viem'
import { sepolia } from 'wagmi/chains'

import { config as dotenvConf } from "dotenv";
dotenvConf();

import BlackjackABI from '../casino-contracts/artifacts/contracts/BlackJack/BlackjackV1.sol/BlackjackV1.json';
import CasinoChipABI from '../casino-contracts/artifacts/contracts/CasinoChip.sol/CasinoChip.json';

export default defineConfig({
  out: 'src/contracts/generatedContracts.ts',
  contracts: [
    { name: 'Blackjack',
      abi: BlackjackABI.abi as Abi,
      address: {
        [sepolia.id]: process.env.NEXT_PUBLIC_BLACKJACK as `0x${string}`,
      }
    },
    { name: 'CasinoChip',
      abi: CasinoChipABI.abi as Abi,
      address: {
        [sepolia.id]: process.env.NEXT_PUBLIC_CHIP as `0x${string}`,
      }
    },
  ],
  plugins: [react()],
})