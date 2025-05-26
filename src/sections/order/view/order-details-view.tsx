'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';

import { Order } from 'src/data/types';
import { getOrder } from 'src/data/api';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { ItemDetails } from '../item-details';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsCustomer } from '../order-details-customer';

// ----------------------------------------------------------------------
interface OrderDetailsViewProps {
  initialOrder: Order;
}

export function OrderDetailsView({ initialOrder }: OrderDetailsViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.orderStatus || 'pending');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  const handleRefetchOrder = useCallback(async () => {
    if (order.id) {
      try {
        setIsRefreshing(true);

        // Fetch the latest order data using the API function
        const updatedOrder = await getOrder(order.id);

        // Update the local state with fresh data
        setOrder(updatedOrder);
        setStatus(updatedOrder.orderStatus || 'pending');

        // Force a router refresh after state update
        router.refresh();
      } catch (error) {
        console.error('Error refreshing order data:', error);
        // You might want to show an error notification here
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [order.id, router]);

  // Add effect to update order when initialOrder changes
  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      setStatus(initialOrder.orderStatus || 'pending');
    }
  }, [initialOrder]);

  // Add effect to handle router refresh
  useEffect(() => {
    const handleRouteChange = () => {
      if (order.id) {
        getOrder(order.id).then((updatedOrder) => {
          setOrder(updatedOrder);
          setStatus(updatedOrder.orderStatus || 'pending');
        });
      }
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [order.id]);

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        id={order.id}
        status={status}
        createdAt={order?.dateOfOrder}
        orderNumber={order?.id}
        backHref={paths.dashboard.order.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        isRefreshing={isRefreshing}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            {order?.orderItems.map((item) => (
              <ItemDetails
                key={item.id}
                item={item}
                order={order}
                onHistoryUpdate={handleRefetchOrder}
              />
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <OrderDetailsCustomer
              name={order?.clientName}
              contactNumber={order?.clientContactNumber}
              comment={order?.comment}
              email="email@email.com"
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
