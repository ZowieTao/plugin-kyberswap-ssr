import { produce } from 'immer';
import { create } from 'zustand';

import { Token } from '@/net/http/kyberswapComponents';

export type ChannelInfo = {
  from?: Token;
  to?: Token;
};

export interface IChannelInfo {
  channelInfo: ChannelInfo | undefined;
  updateChannelInfo: (val: ChannelInfo) => void;
}
export const useChannelInfoStore = create<IChannelInfo>((set) => {
  return {
    channelInfo: undefined,
    updateChannelInfo: (val: ChannelInfo) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.channelInfo = val;
        });
      });
    },
  };
});
