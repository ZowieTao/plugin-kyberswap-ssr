import { produce } from 'immer';

import { Center } from '@/components/core/Flex';
import useLatest from '@/hooks/core/useLatest';
import { isNotEmpty } from '@/utils/core/is';
import { isString } from '@/utils/is';

import { useToastStore } from './store';

let preTimer: any = undefined;

export const showToast = (
  content: string | JSX.Element,
  props?: { duration: number },
) => {
  const { duration = 3000 } = props ?? {};
  clearTimeout(preTimer);
  useToastStore.setState((state) => {
    return produce(state, (draft) => {
      if (isString(content)) {
        draft.content = content.trim();
      } else {
        draft.content = content;
      }
    });
  });
  preTimer = setTimeout(() => {
    hideToast();
  }, duration);
};

export const hideToast = () => {
  useToastStore.setState((state) => {
    return produce(state, (draft) => {
      draft.content = '';
    });
  });
};

export const Toast = () => {
  const content = useToastStore((state) => {
    return state.content;
  });
  const show = isNotEmpty(content);
  const info = useLatest(content, { acceptEmpty: false });

  return (
    <Center
      opacity={show ? 1 : 0}
      transition="0.3s"
      width="100vw"
      top="30px"
      left="0"
      position="fixed"
      zIndex={10}
      pointerEvents="none"
    >
      <Center
        maxWidth="500px"
        padding="6px 20px"
        borderRadius="16px"
        background="#eeeeee"
        boxShadow="0px 4px 6px rgba(40, 40, 40, 0.25)"
      >
        {info.current}
      </Center>
    </Center>
  );
};
