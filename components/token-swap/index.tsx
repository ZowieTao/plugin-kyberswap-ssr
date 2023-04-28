'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { useAccount, useNetwork } from 'wagmi';

import Widget from '@/components/widgets';
import { TokenInfo } from '@/constants';
import { defaultTokenOut } from '@/constants/kyberswap';
import { widgetLightTheme } from '@/constants/style/kyberswap-widget';
import { useClientLogin } from '@/hooks/useClientLogin';
import { useOpencord } from '@/hooks/useOpencord';
import { useChannelInfoStore } from '@/stores/channelInfo';
import { useTokenEditStore } from '@/stores/tokenEdit';
import { fadeInDown, staggerContainer } from '@/styles/variants';

import { Center } from '../core/Flex';
import TokenEditor, { buttonVariants } from '../edit-token';
import { TokenListProvider } from '../widgets/hooks/useTokens';
import { Web3Provider } from '../widgets/hooks/useWeb3Provider';
import { defaultTheme } from '../widgets/theme';

export default function Plugin() {
  const { connector } = useAccount();
  const { chain } = useNetwork();

  // use opencord
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isInitialized, isInOpencord, isInitFailed } = useOpencord();

  // to login
  useClientLogin();

  const channelInfo = useChannelInfoStore((state) => {
    return state.channelInfo;
  });

  const tokenList = useMemo(() => {
    const result: TokenInfo[] = [];
    channelInfo?.from && result.push({ ...channelInfo.from, isImport: true });
    channelInfo?.to && result.push({ ...channelInfo.to, isImport: true });

    return result;
  }, [channelInfo]);

  const _defaultTokenIn = useMemo(() => {
    return channelInfo?.from?.address;
  }, [channelInfo?.from?.address]);

  const _defaultTokenOut = useMemo(() => {
    return channelInfo?.to?.address;
  }, [channelInfo?.to?.address]);

  useEffect(() => {}, [chain]);
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

  const isEditing = useTokenEditStore((state) => {
    return state.editing;
  });
  const changeEditing = useTokenEditStore((state) => {
    return state.changeEditing;
  });

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
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="rest"
                onClick={() => {
                  changeEditing();
                }}
              >
                <Center
                  height="40px"
                  width="40px"
                  background="#ffffff"
                  boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="10px"
                >
                  <Image
                    src="/assets/setting.svg"
                    alt="background image"
                    height="20"
                    width="20"
                  />
                </Center>
              </motion.div>
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
            <Web3Provider provider={provider}>
              <TokenListProvider tokenList={tokenList}>
                <ThemeProvider theme={widgetLightTheme || defaultTheme}>
                  <>
                    {isEditing ? (
                      <TokenEditor />
                    ) : (
                      <Widget
                        defaultTokenIn={_defaultTokenIn}
                        defaultTokenOut={
                          _defaultTokenOut ?? defaultTokenOut[chainId ?? 1]
                        }
                      />
                    )}
                  </>
                </ThemeProvider>
              </TokenListProvider>
            </Web3Provider>
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}

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
