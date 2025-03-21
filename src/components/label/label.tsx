import { forwardRef, ReactNode } from 'react';
import { upperFirst } from 'es-toolkit';
import { mergeClasses } from 'minimal-shared/utils';

import { labelClasses } from './classes';
import { LabelRoot, LabelIcon } from './styles';

// Define props with correct types
type LabelProps = {
  children: ReactNode;
  variant?: 'soft' | 'outlined' | 'filled'; // Adjust variants as needed
  color?: 'default' | 'warning' | 'primary' | 'secondary'; // Adjust colors as needed
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  sx?: any;
};

// Ensure ref is properly typed
export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      endIcon,
      children,
      startIcon,
      className,
      disabled,
      variant = 'soft',
      color = 'default',
      sx,
      ...other
    },
    ref
  ) => {
    return (
      <LabelRoot
        ref={ref}
        color={color}
        variant={variant}
        disabled={disabled}
        className={mergeClasses([labelClasses.root, className])}
        sx={sx}
        {...other}
      >
        {startIcon && <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>}

        {typeof children === 'string' ? upperFirst(children) : children}

        {endIcon && <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>}
      </LabelRoot>
    );
  }
);

// Explicitly set display name for debugging
Label.displayName = 'Label';
