import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
  SwapWidget,
} from '@uniswap/widgets';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import { fadeInDown, staggerContainer } from '@/styles/variants';

const Home: NextPage = () => {
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
    <>
      <AppHeader />
      <main
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
          height: '100vh',
          overflow: 'hidden',
          background: 'url("/bg.svg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <motion.section
          className="hide-scrollbar"
          style={{
            height: '100%',
            overflowY: 'scroll',
          }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <Image
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
            }}
            src="/bg-item.svg"
            alt="background image"
            height="400"
            width="400"
          />
          <motion.header
            variants={fadeInDown}
            style={{
              position: 'relative',
              marginBottom: '10px',
              padding: '20px 15px 0 30px',
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
              }}
            />
            <div
              style={{
                display: 'flex',
                height: '40px',
              }}
            >
              <ConnectButton label="Connect wallet" />
            </div>
          </motion.header>
          <div className="header-space" />
          <motion.div
            variants={fadeInDown}
            style={{
              width: '100vw',
              padding: '24px',
              display: 'flex',
              maxWidth: '100vw',
              boxSizing: 'border-box',
              justifyContent: 'center',
            }}
          >
            <select onChange={onSelectLocale}>
              {SUPPORTED_LOCALES.map((locale) => {
                return (
                  <option key={locale} value={locale}>
                    {locale}
                  </option>
                );
              })}
            </select>
            {chainId}
            <SwapWidget
              tokenList={TOKEN_LIST}
              provider={provider}
              locale={locale}
              defaultInputTokenAddress="NATIVE"
              defaultInputAmount="1"
              defaultOutputTokenAddress={UNI}
            />
          </motion.div>
        </motion.section>
      </main>
    </>
  );
};

export default Home;

const AppHeader = () => {
  return (
    <Head>
      <title>Opencord Kyberswap Widgets Plugin</title>
      <meta
        name="description"
        content="opencord plugin for kyberswap widgets"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
