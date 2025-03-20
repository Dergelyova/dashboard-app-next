import { Chip } from '@mui/material';

const orderStatusColors: Record<number, string> = {
  0: '#9E9E9E', // Grey - Initial step, agreement phase
  1: '#FF9800', // Orange - Preparation stage, some urgency
  2: '#FFC107', // Amber - Development stage, work in progress
  3: '#4CAF50', // Green - Layout is being finalized
  4: '#2196F3', // Blue - Printing phase, major production step
  5: '#673AB7', // Purple - Pre-sewing stage, nearing completion
  6: '#E91E63', // Pink - Sewing, final production phase
};

const orderStatusLabels: Record<number, string> = {
  0: 'Етап 0 | Погодження дизайну',
  1: 'Етап 1 | Підготовка таблиці замовлення (До 1 дня)',
  2: 'Етап 2 | Розробка лекал',
  3: 'Етап 3 | Розкладка (До 3 днів)',
  4: 'Етап 4 | Друк (До 9 днів)',
  5: 'Етап 5 | Підготовка до пошиття (До 3 днів)',
  6: 'Етап 6 | Пошиття (До 14 днів)',
};

export const StepColorChip = ({ stepNumber }: { stepNumber: number }) => {
  return (
    <Chip
      label={orderStatusLabels[stepNumber] || 'Невідомий етап'}
      sx={{
        backgroundColor: orderStatusColors[stepNumber] || '#000000',
        color: '#fff',
      }}
    />
  );
};
