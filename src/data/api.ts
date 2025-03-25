import type { Order, StepHistory } from './types';

const STORAGE_KEY = 'orders';

const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  return getStoredOrders();
};

export const getOrder = (id: string): Order | undefined => {
  const orders = getStoredOrders();
  return orders.find((order) => order.id === parseInt(id));
};

export const createOrder = (order: Order): Order => {
  const orders = getStoredOrders();
  const items = orders.map((order) => order.order_items).flat();
  const newOrder = {
    ...order,
    id: orders.length ? orders[orders.length - 1].id! + 1 : 1,
    order_items: order.order_items.map((item, index) => ({
      ...item,
      id: items.length ? items[items.length - 1].id! + index + 1 : index + 1,
    })),
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrder = (updatedOrder: Order): Order | null => {
  const orders = getStoredOrders();
  const index = orders.findIndex((order) => order.id === updatedOrder.id);
  if (index === -1) return null;
  orders[index] = updatedOrder;
  saveOrders(orders);
  return updatedOrder;
};

export const updateOrderProductHistory = (history: StepHistory[], orderItemId: number) => {
  const orders = getStoredOrders();
  const order = orders.find((order) => order.order_items.find((item) => item.id === orderItemId));
  if (!order) return;
  const orderItem = order.order_items.find((item) => item.id === orderItemId);
  if (!orderItem) return;
  orderItem.item_step_history = history;

  //add logic with order status
  const isOrderCompleted = order.order_items.every(
    (item) => item.item_step_history.length === 7 && !!item.item_step_history[6]?.date_ended
  );

  if (isOrderCompleted) {
    order.order_status = 'completed';
  }
  saveOrders(orders);
};

export const deleteOrder = (orderId: number): boolean => {
  const orders = getStoredOrders();
  const filteredOrders = orders.filter((order) => order.id !== orderId);
  if (filteredOrders.length === orders.length) return false;
  saveOrders(filteredOrders);
  return true;
};
