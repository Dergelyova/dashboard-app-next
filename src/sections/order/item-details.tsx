import { Order, OrderProduct } from 'src/data/types';

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
export const ItemDetails = ({ item, order }: { item: OrderProduct; order: Order }) => {
  const [currentStep, setCurrentStep] = useState(
    item.itemStepHistory.length === 7 && !!item.itemStepHistory[6]?.dateEnded
      ? 7
      : item.itemStepHistory.length - 1
  );
  return (
    <Card sx={{ p: 2, borderBlockEnd: '1px dashed #eeeeee' }}>
      <Stack direction="row" spacing={2}>
        {!!item.itemImage && (
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
              <Typography>{item.itemName}</Typography>
              <Typography variant="body2" color="text.disabled">
                {item.itemModel}
              </Typography>
            </Box>
            <Typography variant="body2">
              x{' '}
              {item.itemColors.reduce(
                (acc, color) =>
                  acc +
                  (color.amountTotal || color.amountKids + color.amountMan + color.amountWoman),
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
          <DataRow fieldName="Найменування">{item.itemName} </DataRow>
          <DataRow fieldName="Модель">{item.itemModel}</DataRow>
          <DataRow fieldName="Виробництво">{item.itemManufacture}</DataRow>
          <DataRow fieldName="Загальна кількість">
            {item.itemColors.reduce(
              (acc, color) =>
                acc + (color.amountTotal || color.amountKids + color.amountMan + color.amountWoman),
              0
            )}{' '}
          </DataRow>
          <DataRow fieldName="Посилання на замовлення">
            <Typography
              variant={'caption'}
              component={'a'}
              sx={{ textDecoration: 'underline' }}
              href={item.itemOrderLink}
            >
              посилання
            </Typography>
          </DataRow>
          <DataRow fieldName="Кольори">
            <Stack spacing={2} direction={'row'} flexWrap={'wrap'}>
              {item.itemColors.map((color, i) => (
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
                      x{color.amountTotal || color.amountKids + color.amountMan + color.amountWoman}
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
                        x{color.amountMan}
                      </Typography>
                    </Stack>
                    <Stack direction={'column'}>
                      <Typography variant="caption">Дит.</Typography>
                      <Typography variant="caption" textAlign={'center'}>
                        x{color.amountKids}
                      </Typography>
                    </Stack>
                    <Stack direction={'column'}>
                      <Typography variant="caption">Жін.</Typography>
                      <Typography variant="caption" textAlign={'center'}>
                        x{color.amountWoman}
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
          history={item.itemStepHistory}
          itemId={item.id || 0}
          updateCurrentStep={setCurrentStep}
          order={order}
        />
      </Box>
    </Card>
  );
};
