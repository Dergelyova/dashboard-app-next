'use client';
import React from 'react';
import OrderForm from './order-form';
import { Order } from 'src/data/types';
import { useRouter } from 'next/navigation';
import { createOrder } from 'src/data/api';
import { formatPatterns } from 'src/utils/format-time';
import dayjs from 'dayjs';
import { defaultItem } from 'src/data/mock';

const NewOrder: React.FC = () => {
  const router = useRouter();
  const handleCreate = async (order: Order) => {
    const newOrder = order;
    try {
      await createOrder(newOrder);
      alert('Замовлення збережено. Ви будете перенаправлені на сторінку замовлень.');
      // Simulate API delay
    } catch {
      alert('Шось пішло не так');
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

  return (
    <div>
      <OrderForm initialData={defaultOrder} onSubmit={handleCreate} />
    </div>
  );
};

export default NewOrder;
