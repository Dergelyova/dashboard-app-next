import { getOrder } from 'src/data/api';

import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

// export const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export const revalidate = 0; // Disable caching for this page

export default async function Page({ params }) {
  const { id } = params;

  // const currentOrder = _orders.find((order) => order.id === id);
  const currentOrder = await getOrder(id);

  return <OrderDetailsView initialOrder={currentOrder} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
// const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
// export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
// export async function generateStaticParams() {
//   if (CONFIG.isStaticExport) {
//     return _orders.map((order) => ({ id: order.id }));
//   }
//   return [];
// }
