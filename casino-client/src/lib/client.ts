"use client"
import { createThirdwebClient } from "thirdweb";
import { config as dotenvConf } from "dotenv";
dotenvConf();
import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
});

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC)
  },
})