'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsItems } from '../order-details-items';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsCustomer } from '../order-details-customer';
import { Order } from 'src/data/types';
import { ItemDetails } from '../item-details';

// ----------------------------------------------------------------------
interface OrderDetailsViewProps {
  order: Order;
}
export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const [status, setStatus] = useState(order.orderStatus || 'pending');

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        status={status}
        createdAt={order?.dateOfOrder}
        orderNumber={order?.id}
        backHref={paths.dashboard.order.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            {order?.orderItems.map((item) => <ItemDetails item={item} order={order} />)}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <OrderDetailsCustomer
              name={order?.clientName}
              contactNumber={order?.clientContactNumber}
              comment={order?.comment}
              email={'email@email.com'}
            />

            {/* <Divider sx={{ borderStyle: 'dashed' }} />
            <OrderDetailsDelivery delivery={order?.delivery} />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <OrderDetailsShipping shippingAddress={order?.shippingAddress} />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <OrderDetailsPayment payment={order?.payment} /> */}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
