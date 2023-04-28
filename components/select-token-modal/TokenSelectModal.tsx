import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { shallow } from 'zustand/shallow';

import {
  AGGREGATOR_PATH,
  NATIVE_TOKEN,
  NATIVE_TOKEN_ADDRESS,
  TokenInfo as TokenDetail,
} from '@/constants';
import { useTokenEditStore } from '@/stores/tokenEdit';
import { hexWithOpacity } from '@/utils/core/format';

import { Box } from '../core/Box';
import { Column, Expand, Row } from '../core/Flex';
import { Dialog } from '../dialogs/dialog/Dialog';
import { DialogContent } from '../dialogs/dialog/DialogContent';
import { useTokens } from '../widgets/hooks/useTokens';
import { useActiveWeb3 } from '../widgets/hooks/useWeb3Provider';
import ImportModal from '../widgets/ImportModal';
import SelectCurrency from '../widgets/SelectCurrency';

export interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  type?: 'in' | 'out';
}

export function TokenSelectModal({
  onClose,
  open,
  type,
}: TokenSelectModalProps) {
  const titleId = 'rk_TokenSelect_modal_title';

  const { address } = useAccount();

  const { chainId } = useActiveWeb3();

  const [importToken, setImportToken] = useState<TokenDetail | undefined>();

  const _onClose = () => {
    setImportToken(undefined);
    onClose();
  };

  const tokens = useTokens();

  const { tokenInfo, updateTokenInfo } = useTokenEditStore((state) => {
    return {
      tokenInfo:
        type !== 'in' && type !== 'out'
          ? undefined
          : type === 'in'
          ? state.tokenIn
          : state.tokenOut,
      updateTokenInfo: state.updateTokenInfo,
    };
  }, shallow);

  if (!address || !type) {
    return null;
  }

  return (
    <>
      {address && (
        <Dialog onClose={_onClose} open={open} titleId={titleId}>
          <DialogContent bottomSheetOnMobile padding="0">
            <Box
              height="600px"
              overflow="hidden"
              width="407px"
              background="white"
              borderRadius="24px"
              padding="1rem"
              className="hide-scrollbar"
            >
              <Row
                textTransform="capitalize"
                position="relative"
                marginBottom="1rem"
                cursor="pointer"
                onClick={_onClose}
              >
                <Image
                  style={{
                    position: 'absolute',
                    top: '0',
                  }}
                  src="/assets/arrow-down.svg"
                  alt="background image"
                  height="18"
                  width="18"
                />
                <Expand justifyContent="center">
                  <Column>
                    <Column marginBottom="0.3rem">Select token</Column>
                    <Column
                      color={hexWithOpacity('#282828', 0.6)}
                      fontSize="12px"
                    >
                      {AGGREGATOR_PATH[chainId]}
                    </Column>
                  </Column>
                </Expand>
              </Row>
              <Box
                display="flex"
                flexDirection="column"
                flex="1"
                gap="1rem"
                maxHeight="550px"
                overflowY="scroll"
                verticalAlign="baseline"
                className="hide-scrollbar"
              >
                {importToken ? (
                  <ImportModal
                    token={importToken}
                    onImport={() => {
                      updateTokenInfo(importToken, type);
                      _onClose();
                    }}
                  />
                ) : (
                  <SelectCurrency
                    selectedToken={tokenInfo?.address ?? ''}
                    onChange={function (address: string): void {
                      const tokenInInfo =
                        address === NATIVE_TOKEN_ADDRESS
                          ? NATIVE_TOKEN[chainId]
                          : tokens.find((item) => {
                              return item.address === address;
                            });

                      tokenInInfo && updateTokenInfo(tokenInInfo, type);

                      _onClose();
                    }}
                    onImport={function (token: TokenDetail): void {
                      setImportToken(token);
                    }}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
