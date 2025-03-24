'use client';

import { getOrder } from 'src/data/api';

import { OrderEditView } from 'src/sections/order/view/order-edit-view';

// ----------------------------------------------------------------------

// export const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export default function Page({ params }) {
  const { id } = params;

  // const currentOrder = _orders.find((order) => order.id === id);
  const currentOrder = getOrder(id);

  return <OrderEditView order={currentOrder} />;
}
