import axios from 'axios';
import type { Order, StepHistory } from './types';

const BASE_URL = 'https://youp-orders-909fe5197b4a.herokuapp.com/api/orders';

export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(BASE_URL);
  return response.data;
};

export const getOrder = async (id: number | string): Promise<Order> => {
  const response = await axios.get<Order>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createOrder = async (order: Order): Promise<Order> => {
  const response = await axios.post<Order>(BASE_URL, order);
  return response.data;
};

export const updateOrder = async (order: Order): Promise<Order> => {
  const response = await axios.put<Order>(`${BASE_URL}/${order.id}`, order);
  return response.data;
};

export const deleteOrder = async (orderId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${orderId}`);
};

export const updateOrderProductHistory = async (
  updatedHistory: StepHistory[],
  orderItemId: number,
  order: Order
): Promise<Order> => {
  const itemIndex = order.orderItems.findIndex((item) => item.id === orderItemId);
  if (itemIndex === -1) throw new Error('Order item not found');

  // Update step history
  order.orderItems[itemIndex].itemStepHistory = updatedHistory;

  // Check if order is completed
  const isOrderCompleted = order.orderItems.every(
    (item) => item.itemStepHistory.length === 7 && !!item.itemStepHistory[6]?.dateEnded
  );

  if (isOrderCompleted) {
    order.orderStatus = 'completed';
  }

  return await updateOrder(order);
};
