'use client';
import { useAsyncEffect } from 'ahooks';

import { login } from '@/net/http/gateway';
import { useAuthInfoStore } from '@/stores/authInfo';
import { useChannelInfoStore } from '@/stores/channelInfo';

export const useClientLogin = () => {
  const authInfo = useAuthInfoStore((state) => {
    return state.authInfo;
  });

  const updateChannelInfo = useChannelInfoStore((state) => {
    return state.updateChannelInfo;
  });

  useAsyncEffect(async () => {
    if (authInfo?.code) {
      const loginResponse = await login({ code: authInfo.code });

      if (loginResponse.data.data.channelInfo) {
        updateChannelInfo(loginResponse.data.data.channelInfo);
      }
    }
  }, [authInfo]);
};
