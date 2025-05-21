'use client';

import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { formatPatterns } from 'src/utils/format-time';

import { Order } from 'src/data/types';
import { createOrder } from 'src/data/api';
import { defaultItem } from 'src/data/mock';

import { toast } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';

import OrderForm from './order-form';

const NewOrder: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (order: Order) => {
    const newOrder = order;
    try {
      setIsLoading(true);
      await createOrder(newOrder);
      toast.success('Замовлення збережено. Ви будете перенаправлені на сторінку замовлень.', {
        duration: 2000,
        position: 'top-center',
      });

      // Add delay before navigation
      setTimeout(() => {
        router.push('/dashboard/order');
      }, 2000);
    } catch {
      toast.error('Шось пішло не так', {
        duration: 2000,
        position: 'top-center',
      });
      setIsLoading(false);
    }
  };

  // Default values for a new order
  const defaultOrder: Order = {
    clientName: '',
    clientContactNumber: '',
    clientEmail: '',
    comment: '',
    dateOfOrder: dayjs(new Date()).format(formatPatterns.dateTime),
    orderType: '',
    orderStatus: 'pending',
    orderItems: [{ ...defaultItem }],
  };

  if (isLoading) {
    return <LoadingScreen portal={false} sx={{}} />;
  }

  return (
    <div>
      <OrderForm initialData={defaultOrder} onSubmit={handleCreate} />
    </div>
  );
};

export default NewOrder;
