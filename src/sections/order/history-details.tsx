'use client';
import { updateOrderProductHistory } from 'src/data/api';
import { STEPS } from 'src/data/mock';
import type { StepHistory } from 'src/data/types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { useState } from 'react';
import { formatPatterns } from 'src/utils/format-time';

// Convert Step History to a Map
const createHistoryDetailsMap = (historyDetails: StepHistory[]): Map<number, StepHistory> => {
  const historyDetailsMap = new Map<number, StepHistory>();
  historyDetails.forEach((history) => {
    historyDetailsMap.set(history.step_id, history);
  });
  return historyDetailsMap;
};

//reverse converting step History to a Map
const revertHistoryDetailsMap = (historyMap: Map<number, StepHistory>): StepHistory[] => {
  return Array.from(historyMap.values());
};

export const HistoryDetails = ({
  history,
  itemId,
  updateCurrentStep,
}: {
  history: StepHistory[];
  itemId: number;
  updateCurrentStep: (step: number) => void;
}) => {
  const [activeStep, setActiveStep] = useState(history.length - 1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completionDate, setCompletionDate] = useState(dayjs().format(formatPatterns.split.date));
  const [historyDetailsMap, setHistoryDetailsMap] = useState<Map<number, StepHistory>>(
    createHistoryDetailsMap(history)
  );

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmFinish = () => {
    //update finished step
    const updatedStepInfo = {
      ...historyDetailsMap.get(activeStep),
      step_id: activeStep,
      date_ended: completionDate,
    } as StepHistory;

    setHistoryDetailsMap((prevMap) => {
      const newMap = new Map(prevMap);
      newMap.set(activeStep, updatedStepInfo);

      //update started step
      if (activeStep < STEPS.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);

        const updatedStartedStepInfo = {
          ...prevMap.get(nextStep),
          step_id: nextStep,
          date_started: completionDate,
        } as StepHistory;

        newMap.set(nextStep, updatedStartedStepInfo);
        updateCurrentStep(nextStep);
      }

      //save new history to db
      const newHistory = revertHistoryDetailsMap(newMap);
      updateOrderProductHistory(newHistory, itemId);

      return newMap;
    });

    //reset completion date
    setCompletionDate(dayjs().format(formatPatterns.split.date));

    //close dialog
    setDialogOpen(false);
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
                  <Stack direction={'column'}>
                    {/* TODO: fix state update time */}
                    <Typography variant="caption" color="text">
                      Днів в етапі:
                      {` ${dayjs(historyDetailsMap.get(step.id)?.date_ended).diff(
                        dayjs(historyDetailsMap.get(step.id)?.date_started),
                        'day'
                      )}`}
                    </Typography>
                    {step.id !== activeStep && (
                      <Typography variant="caption">
                        Дата завершення етапу:
                        {` ${dayjs(historyDetailsMap.get(step.id)?.date_ended).format(
                          formatPatterns.split.date
                        )}`}
                      </Typography>
                    )}
                  </Stack>
                ) : null
              }
            >
              {step.name}{' '}
              <Typography component={'span'} variant="caption">
                {' '}
                {!!step.max_duration_days &&
                  `
                (до ${step.max_duration_days} ${step.max_duration_days === 1 ? 'дня' : 'днів'})
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
          <TextField
            label="Дата завершення"
            type="date"
            fullWidth
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
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
