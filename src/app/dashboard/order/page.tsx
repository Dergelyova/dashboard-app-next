import { getOrders } from 'src/data/api';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

// export const metadata = { title: `Order list | Dashboard - ${CONFIG.appName}` };

export default async function Page() {
  const orders = await getOrders();
  return <OrderListView orders={orders} />;
}
