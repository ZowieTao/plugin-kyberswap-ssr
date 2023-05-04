import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { NATIVE_TOKEN_ADDRESS } from '@/constants';
import { erc20Interface } from '@/constants/multicall';

import { useMulticalContract } from './useContract';
import { useActiveWeb3 } from './useWeb3Provider';

let fetchInterval: undefined | NodeJS.Timer;

const useTokenBalances = (tokenAddresses: string[]) => {
  const { provider, chainId } = useActiveWeb3();
  const multicallContract = useMulticalContract();
  const [balances, setBalances] = useState<{ [address: string]: BigNumber }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!provider) {
      setBalances({});

      return;
    }
    try {
      setLoading(true);
      const listAccounts = await provider.listAccounts();
      const account = listAccounts[0];
      const nativeBalance = await provider.getBalance(account);
      console.log('!!! 1 nativeBalance', nativeBalance);

      const fragment = erc20Interface.getFunction('balanceOf');
      const callData = erc20Interface.encodeFunctionData(fragment, [account]);

      console.log('!!! 2 fragment,callData', fragment, callData);

      // const balance = useBalance();

      const chunks = tokenAddresses.map((address) => {
        return {
          target: address,
          callData,
        };
      });

      const res = await multicallContract?.callStatic.tryBlockAndAggregate(
        false,
        chunks,
      );
      console.log('!!! 3 res', res);

      const balances = res.returnData.map((item: any) => {
        return erc20Interface.decodeFunctionResult(fragment, item.returnData);
      });

      console.log('!!! 4 balances', balances);

      setLoading(false);

      setBalances({
        [NATIVE_TOKEN_ADDRESS]: nativeBalance,
        ...balances.reduce(
          (
            acc: { [address: string]: BigNumber },
            item: { balance: BigNumber },
            index: number,
          ) => {
            return {
              ...acc,
              [tokenAddresses[index]]: item.balance,
            };
          },
          {} as { [address: string]: BigNumber },
        ),
      });
    } catch (e) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, chainId, JSON.stringify(tokenAddresses)]);

  useEffect(() => {
    fetchBalances();
    if (!fetchInterval) {
      fetchInterval = setInterval(() => {
        fetchBalances();
      }, 10_000);
    }

    return () => {
      clearInterval(fetchInterval);
    };
  }, [provider, fetchBalances]);

  return {
    loading,
    balances,
    refetch: fetchBalances,
  };
};

export default useTokenBalances;
