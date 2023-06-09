/* eslint-disable react/display-name */
import { forwardRef } from 'react';

import { BoxProps, getBoxProps } from '../Box';
import styles from './style.module.css';

interface TextInputProps {
  value?: string;
  hint?: string;
  onChange?: (input: string) => void;
  onSubmit?: (input: string) => void;
}

export const TextInput = forwardRef(
  (props: BoxProps & TextInputProps, ref: any) => {
    const boxProps = getBoxProps(props);
    const { value, hint = '', onChange, onSubmit } = props ?? {};

    return (
      <input
        ref={ref}
        {...boxProps}
        className={styles['text-input']}
        value={value}
        placeholder={hint}
        onKeyDown={(event: any) => {
          if (event.key === 'Enter') {
            const str = event.target.value;
            onSubmit?.(str);
          }
        }}
        onChange={(event: any) => {
          const str = event.target.value;
          onChange?.(str);
        }}
      />
    );
  },
);
