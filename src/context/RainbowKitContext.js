"use client";
// react imports
import React, { createContext } from "react";

// rainbowkit imports
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { flowTestnet, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { coinbaseWallet } from 'wagmi/connectors';
import { metaMask } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import { injected } from 'wagmi/connectors'

const dAppMetadata = {
  name: "Your DApp Name",
  url: "https://yourdapp.com",
};

//rainbowkit config

// walletConnect({
//   projectId: '9b4a97010a2d03a05e71209f233ab457',
// }),
// metaMask(),
// injected(),

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "9b4a97010a2d03a05e71209f233ab457",
  chains: [flowTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

//create context

export const RainbowKitContext = createContext();

//create provider
const queryClient = new QueryClient();

export const RainbowProvider = ({ children }) => {
  return (
    <RainbowKitContext.Provider value={config}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RainbowKitContext.Provider>
  );
};
