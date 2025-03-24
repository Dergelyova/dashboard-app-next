'use client';
import React from 'react';
import OrderForm from './order-form';
import { Order } from 'src/data/types';
import { updateOrder } from 'src/data/api';
import { useRouter } from 'next/navigation';

interface EditOrderProps {
  order: Order;
}

const EditOrder: React.FC<EditOrderProps> = ({ order }) => {
  const router = useRouter();
  const handleUpdate = (order: Order) => {
    const newOrder = order;
    setTimeout(() => {
      console.log(newOrder);
      updateOrder(newOrder);

      alert('Замовлення збережено. Ви будете перенаправлені на сторінку замовлень.');

      setTimeout(() => {
        router.push('/orders/');
      }, 2000);
    }, 1000); // Simulate API delay
  };

  return (
    <div>
      <OrderForm initialData={order} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditOrder;
