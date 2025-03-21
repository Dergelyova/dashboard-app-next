import { varAlpha } from 'minimal-shared/utils';
import { styled } from '@mui/material/styles';

interface LabelProps {
  color?: string;
  variant?: 'filled' | 'outlined' | 'soft' | 'inverted';
  disabled?: boolean;
}

export const LabelRoot = styled('span', {
  shouldForwardProp: (prop) => !['color', 'variant', 'disabled', 'sx'].includes(prop as string),
})<LabelProps>(({ color = 'default', variant = 'soft', disabled, theme }) => {
  const defaultStyles = {
    ...(color === 'default' && {
      ...(variant === 'filled' && {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.text.primary,
        ...theme.applyStyles('dark', { color: theme.palette.grey[800] }),
      }),
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
      }),
      ...(variant === 'soft' && {
        color: theme.palette.text.secondary,
        backgroundColor: varAlpha(theme.palette.grey['500Channel'], 0.16),
      }),
      ...(variant === 'inverted' && {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
      }),
    }),
  };

  const colorStyles =
    color !== 'default'
      ? {
          ...(variant === 'filled' && {
            color: theme.palette[color].contrastText,
            backgroundColor: theme.palette[color].main,
          }),
          ...(variant === 'outlined' && {
            backgroundColor: 'transparent',
            color: theme.palette[color].main,
            border: `2px solid ${theme.palette[color].main}`,
          }),
          ...(variant === 'soft' && {
            color: theme.palette[color].dark,
            backgroundColor: varAlpha(theme.palette[color].mainChannel, 0.16),
            ...theme.applyStyles('dark', { color: theme.palette[color].light }),
          }),
          ...(variant === 'inverted' && {
            color: theme.palette[color].darker,
            backgroundColor: theme.palette[color].lighter,
          }),
        }
      : {};

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    gap: theme.spacing(0.75),
    justifyContent: 'center',
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: theme.shape.borderRadius * 0.75,
    transition: theme.transitions.create(['all'], { duration: theme.transitions.duration.shorter }),
    ...defaultStyles,
    ...colorStyles,
    ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
  };
});

export const LabelIcon = styled('span')({
  width: 16,
  height: 16,
  flexShrink: 0,
  '& svg, img': { width: '100%', height: '100%', objectFit: 'cover' },
});
