import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef } from 'react';

const moveFocusWithin = (element: HTMLElement, position: 'start' | 'end') => {
  const focusableElements = element.querySelectorAll(
    'button:not(:disabled), a[href]',
  ) as NodeListOf<HTMLButtonElement | HTMLAnchorElement>;

  if (focusableElements.length === 0) {
    return;
  }

  focusableElements[
    position === 'end' ? focusableElements.length - 1 : 0
  ].focus();
};

export function FocusTrap(props: JSX.IntrinsicElements['div']) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyActiveElement = document.activeElement;

    return () => {
      (previouslyActiveElement as HTMLElement).focus?.();
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const elementToFocus =
        contentRef.current.querySelector('[data-auto-focus]');
      if (elementToFocus) {
        (elementToFocus as HTMLElement).focus();
      } else {
        contentRef.current.focus();
      }
    }
  }, [contentRef]);

  return (
    <>
      <div
        onFocus={useCallback(() => {
          return (
            contentRef.current && moveFocusWithin(contentRef.current, 'end')
          );
        }, [])}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div
          ref={contentRef}
          style={{ outline: 'none' }}
          tabIndex={-1}
          {...props}
        />
      </motion.div>
      <div
        onFocus={useCallback(() => {
          return (
            contentRef.current && moveFocusWithin(contentRef.current, 'start')
          );
        }, [])}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
      />
    </>
  );
}
