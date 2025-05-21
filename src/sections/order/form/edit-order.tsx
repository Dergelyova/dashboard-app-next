'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Order } from 'src/data/types';
import { updateOrder } from 'src/data/api';

import OrderForm from './order-form';

interface EditOrderProps {
  order: Order;
}

const EditOrder: React.FC<EditOrderProps> = ({ order }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (order: Order) => {
    try {
      setIsSubmitting(true);
      await updateOrder(order);
      router.push('/dashboard/order');
    } catch (error) {
      console.error('Failed to update order:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <OrderForm initialData={order} onSubmit={handleUpdate} isSubmitting={isSubmitting} />
    </div>
  );
};

export default EditOrder;
