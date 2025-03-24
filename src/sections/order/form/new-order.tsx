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
  const handleCreate = (order: Order) => {
    const newOrder = order;
    setTimeout(() => {
      console.log(newOrder);
      createOrder(newOrder);

      alert('Замовлення збережено. Ви будете перенаправлені на сторінку замовлень.');

      setTimeout(() => {
        router.push('dashboard/order');
      }, 2000);
    }, 1000); // Simulate API delay
  };

  // Default values for a new order
  const defaultOrder: Order = {
    client_name: '',
    client_contact_number: '',
    client_email: '',
    comment: '',
    date_of_order: dayjs(new Date()).format(formatPatterns.date),
    order_type: '',
    order_items: [{ ...defaultItem }],
  };

  return (
    <div>
      <OrderForm initialData={defaultOrder} onSubmit={handleCreate} />
    </div>
  );
};

export default NewOrder;
