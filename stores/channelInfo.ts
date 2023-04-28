import { produce } from 'immer';
import { create } from 'zustand';

import { ChannelInfo } from '@/db';

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
