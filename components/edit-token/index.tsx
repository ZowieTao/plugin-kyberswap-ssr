import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { shallow } from 'zustand/shallow';

import { Text } from '@/components/core/Text';
import { setup } from '@/net/http/gateway';
import { useChannelInfoStore } from '@/stores/channelInfo';
import { useTokenEditStore } from '@/stores/tokenEdit';
import { hexWithOpacity } from '@/utils/core/format';

import { Column, Expand, Row } from '../core/Flex';
import { useModalStateValue } from '../dialogs/dialog/Dialog';
import { showToast } from '../dialogs/toast/toast';
import { TokenSelectModal } from '../select-token-modal/TokenSelectModal';
import { useImportedTokens } from '../widgets/hooks/useTokens';

export const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.025,
  },
};

const TokenEditor = () => {
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();

  const {
    closeModal: closeTokenSelectModal,
    isModalOpen: tokenSelectModalOpen,
    openModal: openTokenSelectModal,
  } = useModalStateValue();

  const { isConnected } = useAccount();

  const { chain: activeChain } = useNetwork();

  const { changeEditing, tokenIn, tokenOut, updateTokenInfo } =
    useTokenEditStore((state) => {
      return {
        changeEditing: state.changeEditing,
        tokenIn: state.tokenIn,
        tokenOut: state.tokenOut,
        updateTokenInfo: state.updateTokenInfo,
      };
    }, shallow);

  const { updateChannelInfo, channelInfo } = useChannelInfoStore((state) => {
    return {
      updateChannelInfo: state.updateChannelInfo,
      channelInfo: state.channelInfo,
    };
  }, shallow);

  const { addToken } = useImportedTokens();

  const { name } = activeChain ?? {};

  const [type, setType] = useState<'in' | 'out' | undefined>();

  return (
    <Column
      zIndex="1"
      maxWidth="400px"
      fontWeight={'400'}
      fontSize="14px"
      lineHeight={'17px'}
      color={hexWithOpacity('#282828', 0.6)}
      marginTop="-30px"
      alignItems={'start'}
    >
      <TokenSelectModal
        onClose={closeTokenSelectModal}
        open={tokenSelectModalOpen}
        type={type}
      />
      <Column width="100%">
        <Image
          src="/assets/empty-state.svg"
          alt="background image"
          height="160"
          width="260"
        />
      </Column>
      <Text fontSize="13px" lineHeight={'16px'} marginTop="50px">
        Please fill out the form below to receive your NFT airdrop. We will use
        the provided wallet address to send your NFT, and your email address to
        notify you when the minting process begins.
      </Text>
      <SelectItem
        title={'Chain'}
        pleaseHolder={name ?? 'Select chain'}
        onClick={isConnected ? openChainModal : openConnectModal}
      />
      <SelectItem
        title={'From (default)'}
        pleaseHolder={tokenIn?.name ?? 'Select token'}
        onClick={() => {
          setType('in');
          openTokenSelectModal();
        }}
      />
      <SelectItem
        title={'Swap to (default)'}
        pleaseHolder={tokenOut?.name ?? 'Select token'}
        onClick={() => {
          setType('out');
          openTokenSelectModal();
        }}
      />
      <Column width="100%" marginTop="30px">
        <HoverScaleBox
          onClick={async () => {
            if (!channelInfo?.channelId) {
              return showToast('Channel Not Exist');
            }
            const result = await setup({
              channelId: channelInfo.channelId,
              tokensInfo: {
                tokenIn,
                tokenOut,
              },
            });
            if (result.data.data.success) {
              changeEditing(false);
              tokenIn && addToken(tokenIn);
              tokenOut && addToken(tokenOut);
              updateChannelInfo({
                channelId: channelInfo.channelId,
                from: tokenIn,
                to: tokenOut,
              });
              showToast('Edit Success');
            }
          }}
        >
          Start
        </HoverScaleBox>
      </Column>
      <Column width="100%" marginTop="1px">
        <HoverScaleBox
          onClick={() => {
            updateTokenInfo(channelInfo?.from, 'in');
            updateTokenInfo(channelInfo?.to, 'out');
            changeEditing(false);
          }}
          background="transparent"
          boxShadow=""
        >
          Set up later
        </HoverScaleBox>
      </Column>
    </Column>
  );
};

const SelectItem = (props: {
  title: string;
  pleaseHolder: string;
  children?: ReactNode;
  onClick?: () => void;
}) => {
  const { title, pleaseHolder, onClick } = props;

  return (
    <>
      <Text marginTop="30px">{title}</Text>
      <motion.div
        variants={buttonVariants}
        whileHover="hover"
        whileTap="rest"
        onClick={onClick}
        style={{
          width: '100%',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <Row
          boxSizing="border-box"
          height={'40px'}
          width="100%"
          background={'#ffffff'}
          color="#282828"
          borderRadius="4px"
          padding="10px"
          marginTop="20px"
        >
          {pleaseHolder}
          <Expand />
          {props?.children} &gt;
        </Row>
      </motion.div>
    </>
  );
};

export default TokenEditor;

const HoverScaleBox = (props: {
  children: ReactNode;
  onClick?: () => void;
  background?: string;
  boxShadow?: string;
}) => {
  const {
    background = '#ffffff',
    boxShadow = `0px 4px 4px ${hexWithOpacity('#000000', 0.15)}`,
  } = props;

  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="rest"
      onClick={props.onClick}
      style={{
        width: '100%',
        height: '38px',
        borderRadius: '4px',
        border: 'none',
        outline: 'none',
        cursor: props.onClick ? 'pointer' : 'default',
        fontWeight: '500',
        fontSize: '14px',
        background,
        boxShadow,
      }}
    >
      {props.children}
    </motion.button>
  );
};
