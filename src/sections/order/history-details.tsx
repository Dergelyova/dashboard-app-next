'use client';

import type { Order, StepHistory } from 'src/data/types';

import dayjs from 'dayjs';
import { useState } from 'react';

import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Box,
  Step,
  Stack,
  Button,
  Dialog,
  Stepper,
  StepLabel,
  Typography,
  DialogTitle,
  StepContent,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { formatPatterns } from 'src/utils/format-time';

import { STEPS } from 'src/data/mock';
import { updateOrderProductHistory } from 'src/data/api';

// Convert Step History to a Map
const createHistoryDetailsMap = (historyDetails: StepHistory[]): Map<number, StepHistory> => {
  const historyDetailsMap = new Map<number, StepHistory>();
  historyDetails.forEach((history) => {
    historyDetailsMap.set(history.stepId, history);
  });
  console.log(historyDetailsMap);
  return historyDetailsMap;
};

//reverse converting step History to a Map
const revertHistoryDetailsMap = (historyMap: Map<number, StepHistory>): StepHistory[] =>
  Array.from(historyMap.values());

export function getDurationInDaysAndHours(
  startStr?: string,
  endStr?: string,
  format?: string
): string {
  if (!startStr) return '';

  const start = dayjs(startStr, format);
  const end = dayjs(endStr ?? dayjs().format(format), format);

  const days = end.diff(start, 'day');
  const hours = end.diff(start, 'hour') % 24;

  return `${days} дн. ${hours} год.`;
}

export const HistoryDetails = ({
  history,
  itemId,
  updateCurrentStep,
  order,
  onHistoryUpdate,
}: {
  history: StepHistory[];
  itemId: number;
  updateCurrentStep: (step: number) => void;
  order: Order;
  onHistoryUpdate: () => Promise<void>;
}) => {
  const [activeStep, setActiveStep] = useState(() => {
    if (!history) return 1;

    // Find the last completed step
    const lastCompletedStep = history.find((h) => h.stepId === 6 && h.dateEnded);
    if (lastCompletedStep) return 7;

    // Find the current step (last step without dateEnded)
    const currentStep = history.reduce(
      (max, h) => (!h.dateEnded && h.stepId > max ? h.stepId : max),
      0
    );

    return currentStep || 1;
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionDate, setCompletionDate] = useState<string>(
    dayjs().format(formatPatterns.dateTime)
  );
  const [historyDetailsMap, setHistoryDetailsMap] = useState<Map<number, StepHistory>>(
    createHistoryDetailsMap(history)
  );

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmFinish = async () => {
    try {
      await updateOrderProductHistory(completionDate, itemId);
      await onHistoryUpdate();

      //reset completion date
      setCompletionDate(dayjs().format(formatPatterns.dateTime));

      //close dialog
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to update history:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {STEPS.map((step, index) => (
          <Step key={step.id}>
            <StepLabel
              icon={`${step.id}`}
              optional={
                step.id <= activeStep ? (
                  <Stack direction="column">
                    {/* TODO: fix state update time */}
                    <Typography variant="caption" color="text">
                      Час в етапі:
                      {` ${getDurationInDaysAndHours(
                        historyDetailsMap.get(step.id)?.dateStarted,
                        historyDetailsMap.get(step.id)?.dateEnded,
                        formatPatterns.dateTime
                      )}`}{' '}
                    </Typography>
                    {step.id !== activeStep && (
                      <Typography variant="caption">
                        Дата завершення етапу:
                        {` ${dayjs(
                          historyDetailsMap.get(step.id)?.dateEnded,
                          formatPatterns.dateTime
                        ).format(formatPatterns.dateTime)}`}
                      </Typography>
                    )}
                  </Stack>
                ) : null
              }
            >
              {step.name}{' '}
              <Typography component="span" variant="caption">
                {' '}
                {!!step.maxDurationDays &&
                  `
                (до ${step.maxDurationDays} ${step.maxDurationDays === 1 ? 'дня' : 'днів'})
              `}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handleOpenDialog} sx={{ mt: 1, mr: 1 }}>
                  {index === STEPS.length - 1 ? 'Завершити замовлення' : 'Завершити етап'}
                </Button>
                {/* <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button> */}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Підтвердження завершення етапу</DialogTitle>
        <DialogContent>
          <Typography>Ви впевнені, що хочете завершити цей етап?</Typography>
          <DateTimePicker
            label="Дата завершення"
            value={dayjs(completionDate, formatPatterns.dateTime)}
            format={formatPatterns.dateTime}
            onChange={(e) => setCompletionDate(e.format(formatPatterns.dateTime))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Скасувати
          </Button>
          <Button onClick={handleConfirmFinish} color="primary" variant="contained">
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
