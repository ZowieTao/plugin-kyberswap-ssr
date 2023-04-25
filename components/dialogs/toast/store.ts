import { produce } from 'immer';
import create from 'zustand';

export interface IToast {
  content: string;
  id: string | number;
  openToast: (props: { content: string; id?: string | number }) => void;
  clearToast: () => void;
}
export const useToastStore = create<IToast>((set) => {
  return {
    content: '',
    id: '',
    openToast: (props: { content: string; id?: string | number }) => {
      const { content, id } = props;
      set((state) => {
        return produce(state, (draft) => {
          draft.content = content;
          if (id) {
            draft.id = id;
          }
        });
      });
    },
    clearToast: () => {
      set((state) => {
        return produce(state, (draft) => {
          draft.content = '';
          draft.id = '';
        });
      });
    },
  };
});
