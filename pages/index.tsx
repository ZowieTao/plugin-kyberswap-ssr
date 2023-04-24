/* eslint-disable @typescript-eslint/no-unused-vars */
import '@uniswap/widgets/fonts.css';

import { SupportedLocale, SwapWidget } from '@uniswap/widgets';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export default function Home() {
  const { connector } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {}, [chain]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chainId, setChainId] = useState(1);
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >(undefined);

  useEffect(() => {
    if (connector) {
      connector.getProvider().then((walletProvider) => {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider,
          'any',
        );
        setProvider(web3Provider);
      });
    } else {
      setProvider(undefined);
    }
  }, [connector, chain]);

  useEffect(() => {
    provider &&
      provider.getNetwork().then((res: any) => {
        return setChainId(res.chainId);
      });
  }, [provider]);

  // uniswap
  // const JSON_RPC_URL = 'https://cloudflare-eth.com';
  const TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
  const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
  const [locale, setLocale] = useState<SupportedLocale>('en-US');
  const onSelectLocale = useCallback((e: any) => {
    return setLocale(e.target.value);
  }, []);

  // const connectors = useRef<HTMLDivElement>(null);
  // const focusConnectors = useCallback(() => {
  //   return connectors.current?.focus();
  // }, []);
  return (
    <div className="Uniswap">
      <SwapWidget provider={provider} />
    </div>
  );
}
