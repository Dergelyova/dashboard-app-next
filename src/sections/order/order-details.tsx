'use client';
import { Card, Stack, Typography } from '@mui/material';
import { ItemDetails } from './item-details';
import { Order } from 'src/data/types';

export const OrderDetails = ({ order }: { order: Order }) => {
  // const order = getOrder(id);
  return (
    <Card>
      <Typography variant="body1" fontWeight={'bold'} mb={2}>
        Деталі замовлення
      </Typography>
      <Stack spacing={2}>
        {order?.order_items.map((item, i) => <ItemDetails key={i} item={item} />)}
      </Stack>
    </Card>
  );
};
