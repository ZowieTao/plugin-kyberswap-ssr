'use client';
import { useAsyncEffect } from 'ahooks';
import { produce } from 'immer';

import { showToast } from '@/components/dialogs/toast/toast';
import { useImportedTokens } from '@/components/widgets/hooks/useTokens';
import { login } from '@/net/http/kyberswap';
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

      const { token, from, to, manageable } = loginResponse.data;

      updateChannelInfo({ from, to });

      if (loginResponse.data) {
        setAuthToken(token);

        updateTokenInfo(from, 'in');
        updateTokenInfo(to, 'out');
        from && addToken(from);
        to && addToken(to);
      }

      useTokenEditStore.setState((state) => {
        return produce(state, (draft) => {
          draft.editable = manageable;
          if (manageable && !from && !to) {
            showToast('set token first');
            draft.editing = true;
          }
        });
      });
    }
  }, [authInfo]);
};
