'use client';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { Toast } from '@/components/dialogs/toast/toast';

import Plugin from '../token-swap';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'Opencord',
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function MainClient() {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <Toast />
        <Plugin />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
