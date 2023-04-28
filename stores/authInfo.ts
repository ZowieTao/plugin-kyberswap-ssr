import { AuthInfo } from '@opencord/client/lib/model/opencord';
import { produce } from 'immer';
import { create } from 'zustand';

export interface IAuthInfo {
  authInfo: AuthInfo | undefined;
  updateAuthInfo: (val: AuthInfo) => void;
}
export const useAuthInfoStore = create<IAuthInfo>((set) => {
  return {
    authInfo: undefined,
    updateAuthInfo: (val: AuthInfo) => {
      set((state) => {
        return produce(state, (draft) => {
          draft.authInfo = val;
        });
      });
    },
  };
});
