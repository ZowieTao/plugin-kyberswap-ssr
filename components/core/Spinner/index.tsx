import { useEffect, useState } from 'react';

import { BoxProps, getBoxProps } from '../Box';
import styles from './style.module.css';

type ThemeType = 'light' | 'dark';

interface SpinnerProps extends BoxProps {
  size?: string;
  color?: string;
  background?: string;
  thickness?: string;
  delay?: number;
  theme?: ThemeType;
}

export const Spinner = (props: SpinnerProps) => {
  const {
    size = 40,
    delay,
    thickness = '4px',
    theme,
    color = theme === 'light' ? '#28E0B9' : '#fff',
    background = theme === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)',
  } = props;
  const style = {
    width: size,
    height: size,
    border: `${thickness} solid ${background}`,
    borderTop: `${thickness} solid ${color}`,
  };
  const boxProps = getBoxProps({
    ...props,
    ...{ style, className: styles.spinner },
  });

  const [initialized, setInitialized] = useState(!delay);
  useEffect(() => {
    setTimeout(() => {
      setInitialized(true);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initialized ? <div {...boxProps} /> : <div />;
};
