"use client";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'wagmi';
import { config } from "../lib/client";
import type { Metadata } from "next";
import { useState, type ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata: Metadata = {
  title: "Casino Sepolia",
  description:
    "Playing different casino games on Ethereum Sepolia",
};

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ThirdwebProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThirdwebProvider>
  );
}
