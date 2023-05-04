'use client';
import { useAsyncEffect } from 'ahooks';
import { produce } from 'immer';

import { useImportedTokens } from '@/components/widgets/hooks/useTokens';
import { login } from '@/net/http/gateway';
import { useAuthInfoStore } from '@/stores/authInfo';
import { useChannelInfoStore } from '@/stores/channelInfo';
import { useTokenEditStore } from '@/stores/tokenEdit';
import { setAuthToken } from '@/utils/auth';

export const useClientLogin = () => {
  const authInfo = useAuthInfoStore((state) => {
    return state.authInfo;
  });

  const updateChannelInfo = useChannelInfoStore((state) => {
    return state.updateChannelInfo;
  });

  const updateTokenInfo = useTokenEditStore((state) => {
    return state.updateTokenInfo;
  });

  const { addToken } = useImportedTokens();

  useAsyncEffect(async () => {
    if (authInfo?.code) {
      const loginResponse = await login({ code: authInfo.code });

      const { data } = loginResponse.data;

      updateChannelInfo({ ...data.channelInfo, channelId: data.channelId });

      if (data.channelInfo) {
        const { from, to } = data.channelInfo;
        updateTokenInfo(from, 'in');
        updateTokenInfo(to, 'out');
        from && addToken(from);
        to && addToken(to);
      }

      if (data.token) {
        setAuthToken(data.token);
      }

      useTokenEditStore.setState((state) => {
        return produce(state, (draft) => {
          draft.editable = data.allowed;
        });
      });
    }
  }, [authInfo]);
};
