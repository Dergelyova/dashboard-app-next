import { OrderProduct } from 'src/data/types';

import { Box, Card, Divider, Grid2, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { HistoryDetails } from './history-details';
import { useState } from 'react';
import { Label } from 'src/components/label';
import { StepColorChip } from './order-details-item-status-label';

const DataRow = ({ fieldName, children }: { fieldName: string; children: React.ReactNode }) => {
  return (
    <>
      <Grid2 size={4} p={1}>
        <Typography variant="subtitle2" color="text.disabled">
          {fieldName}
        </Typography>
      </Grid2>
      <Grid2 size={8} p={1}>
        {children}
      </Grid2>
    </>
  );
};
export const ItemDetails = ({ item }: { item: OrderProduct }) => {
  const [currentStep, setCurrentStep] = useState(
    item.item_step_history.length === 7 && !!item.item_step_history[6]?.date_ended
      ? 7
      : item.item_step_history.length - 1
  );
  return (
    <Card sx={{ p: 2, borderBlockEnd: '1px dashed #eeeeee' }}>
      <Stack direction="row" spacing={2}>
        {!!item.item_image && (
          <Box>
            <Image
              src={'/assets/images/mock/m-product/product-2.webp'}
              alt="t-shirt example"
              width={70}
              style={{ borderRadius: '10px' }}
              height={70}
            />
          </Box>
        )}
        <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
          <Stack direction={'column'} justifyContent={'space-between'}>
            <Box>
              <Typography>{item.item_name}</Typography>
              <Typography variant="body2" color="text.disabled">
                {item.item_model}
              </Typography>
            </Box>
            <Typography variant="body2">
              x{' '}
              {item.item_colors.reduce(
                (acc, color) =>
                  acc +
                  (color.amount_total || color.amount_kids + color.amount_man + color.amount_woman),
                0
              )}{' '}
            </Typography>
          </Stack>

          <StepColorChip stepNumber={currentStep} />
        </Stack>
      </Stack>
      <Box>
        <Grid2
          container
          marginBlock={2}
          sx={{
            '--Grid-borderWidth': '0.8px',
            borderTop: 'var(--Grid-borderWidth) dashed',
            borderLeft: 'var(--Grid-borderWidth) dashed',
            borderColor: 'divider',
            borderRadius: '10px',
            '& > div': {
              borderRight: 'var(--Grid-borderWidth) dashed',
              borderBottom: 'var(--Grid-borderWidth) dashed',
              borderColor: 'divider',
            },
          }}
        >
          <DataRow fieldName="Найменування">{item.item_name} </DataRow>
          <DataRow fieldName="Модель">{item.item_model}</DataRow>
          <DataRow fieldName="Виробництво">{item.item_manufacture}</DataRow>
          <DataRow fieldName="Загальна кількість">
            {item.item_colors.reduce(
              (acc, color) =>
                acc +
                (color.amount_total || color.amount_kids + color.amount_man + color.amount_woman),
              0
            )}{' '}
          </DataRow>
          <DataRow fieldName="Посилання на замовлення">
            <Typography
              variant={'caption'}
              component={'a'}
              sx={{ textDecoration: 'underline' }}
              href={item.item_order_link}
            >
              посилання
            </Typography>
          </DataRow>
          <DataRow fieldName="Кольори">
            <Stack spacing={2} direction={'row'} flexWrap={'wrap'}>
              {item.item_colors.map((color, i) => (
                //color info view
                <Box
                  key={i}
                  p={1}
                  border={'0.6px dashed'}
                  borderColor={'text.disabled'}
                  borderRadius={'10px'}
                  display={'inline-flex'}
                  flexDirection={'column'}
                >
                  <Typography alignSelf={'center'} pb={1}>
                    {color.color}
                    <Typography component={'span'} fontStyle={'bold'} color={'text.disabled'}>
                      {' '}
                      x
                      {color.amount_total ||
                        color.amount_kids + color.amount_man + color.amount_woman}
                    </Typography>
                  </Typography>
                  <Divider />
                  <Stack
                    direction={'row'}
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Stack direction={'column'}>
                      <Typography variant="caption">Чол.</Typography>
                      <Typography variant="caption" textAlign={'center'}>
                        x{color.amount_man}
                      </Typography>
                    </Stack>
                    <Stack direction={'column'}>
                      <Typography variant="caption">Дит.</Typography>
                      <Typography variant="caption" textAlign={'center'}>
                        x{color.amount_kids}
                      </Typography>
                    </Stack>
                    <Stack direction={'column'}>
                      <Typography variant="caption">Жін.</Typography>
                      <Typography variant="caption" textAlign={'center'}>
                        x{color.amount_woman}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </DataRow>
        </Grid2>
        <Box></Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Typography fontWeight={'bold'}>Історія</Typography>
        <HistoryDetails
          history={item.item_step_history}
          itemId={item.id || 0}
          updateCurrentStep={setCurrentStep}
        />
      </Box>
    </Card>
  );
};
