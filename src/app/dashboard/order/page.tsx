'use client';

import { getOrders } from 'src/data/api';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

// export const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const orders = getOrders();
  return <OrderListView orders={orders} />;
}
