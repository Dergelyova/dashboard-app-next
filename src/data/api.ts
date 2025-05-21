import axios from 'axios';

import type { Order } from './types';

const BASE_URL = 'https://youp-orders-909fe5197b4a.herokuapp.com/api/orders';
const BASE_URL_DEV = 'https://youp-orders-909fe5197b4a.herokuapp.com';

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
  date: string,
  orderItemId: number
): Promise<Order> => {
  //pass data as params

  const params = { date, orderItemId };
  const response = await axios.post(`${BASE_URL_DEV}/api/step-history/move-to-next`, params);
  return response.data;
};
