import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { RemoveScroll } from 'react-remove-scroll';

import { Box } from '@/components/core/Box';
import { isMobile } from '@/utils/is';

import { FocusTrap } from './FocusTrap';

const stopPropagation: MouseEventHandler<unknown> = (event) => {
  return event.stopPropagation();
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  onMountAutoFocus?: (event: Event) => void;
  children: ReactNode;
}

export function useModalStateValue() {
  const [isModalOpen, setModalOpen] = useState(false);

  return {
    closeModal: useCallback(() => {
      return setModalOpen(false);
    }, []),
    isModalOpen,
    openModal: useCallback(() => {
      return setModalOpen(true);
    }, []),
  };
}

export function Dialog({ children, onClose, open, titleId }: DialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      return open && event.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      return document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const [bodyScrollable, setBodyScrollable] = useState(true);
  useEffect(() => {
    setBodyScrollable(
      getComputedStyle(window.document.body).overflow !== 'hidden',
    );
  }, []);

  const handleBackdropClick = useCallback(() => {
    return onClose();
  }, [onClose]);
  const mobile = isMobile();

  const positionAttribute = {
    bottom: '-200px',
    left: '-200px',
    padding: '200px',
    right: '-200px',
    top: '-200px',
    transform: 'translateZ(0)',
    zIndex: 2147483646,
  };

  return (
    <>
      {open
        ? createPortal(
            <RemoveScroll enabled={bodyScrollable}>
              <Box>
                <Box
                  {...positionAttribute}
                  className="dialog-animation"
                  alignItems={mobile ? 'flex-end' : 'center'}
                  aria-labelledby={titleId}
                  aria-modal
                  onClick={handleBackdropClick}
                  position="fixed"
                  background="rgba(0, 0, 0, 0.3)"
                  backdropFilter="blur(0px)"
                  display="flex"
                  style={{
                    border: '0',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    fontSize: '100%',
                    lineHeight: 'normal',
                    margin: '0',
                    padding: '0',
                    textAlign: 'left',
                    verticalAlign: 'baseline',
                  }}
                >
                  <FocusTrap onClick={stopPropagation} role="document">
                    {children}
                  </FocusTrap>
                </Box>
              </Box>
            </RemoveScroll>,
            document.body,
          )
        : null}
    </>
  );
}
