import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { type Abi } from 'viem'
import { etherlinkTestnet } from 'wagmi/chains'

import { config as dotenvConf } from "dotenv";
dotenvConf();

import BlackjackABI from '../casino-contract/artifacts/contracts/BlackJack/BlackjackV1.sol/BlackjackV1.json';

export default defineConfig({
  out: 'src/contracts/generatedContracts.ts',
  contracts: [
    { name: 'Blackjack', 
      abi: BlackjackABI.abi as Abi, 
      address: {
        [etherlinkTestnet.id]: process.env.NEXT_PUBLIC_BLACKJACK as string,
      }
    },
  ],
  plugins: [react()],
})