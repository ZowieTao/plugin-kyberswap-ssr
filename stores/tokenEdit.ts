import { produce } from 'immer';
import { create } from 'zustand';

import { TokenInfo } from '@/constants';

export interface ITokenEdit {
  editing: boolean;
  editable: boolean;
  changeEditing: (editState?: boolean) => void;
  tokenIn: TokenInfo | undefined;
  tokenOut: TokenInfo | undefined;
  updateTokenInfo: (val: TokenInfo | undefined, type: 'in' | 'out') => void;
}
export const useTokenEditStore = create<ITokenEdit>((set) => {
  return {
    editing: false,
    editable: false,
    changeEditing: (editState?: boolean) => {
      set((state) => {
        return produce(state, (draft) => {
          if (editState) {
            draft.editing = editState;
          } else {
            draft.editing = !draft.editing;
          }
        });
      });
    },
    tokenIn: undefined,
    tokenOut: undefined,
    updateTokenInfo: (val: TokenInfo | undefined, type: 'in' | 'out') => {
      set((state) => {
        return produce(state, (draft) => {
          if (type === 'in') {
            draft.tokenIn = val;
          }
          if (type === 'out') {
            draft.tokenOut = val;
          }
        });
      });
    },
  };
});
