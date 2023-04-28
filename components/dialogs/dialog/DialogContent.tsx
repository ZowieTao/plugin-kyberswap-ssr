/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useContext } from 'react';

import { Box, BoxProps } from '@/components/core/Box';
import { isMobile } from '@/utils/is';

interface DialogContentProps {
  children: ReactNode;
  bottomSheetOnMobile?: boolean;
  padding?: BoxProps['padding'];
  marginTop?: BoxProps['marginTop'];
  wide?: boolean;
}

export function DialogContent({
  bottomSheetOnMobile = false,
  children,
  marginTop,
  padding = '16',
  wide = false,
}: DialogContentProps) {
  const mobile = isMobile();

  return (
    <Box marginTop={marginTop}>
      <Box>
        <Box padding={padding}>{children}</Box>
      </Box>
    </Box>
  );
}
