import { CONFIG } from 'src/global-config';

import { OrderCreateView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new order | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrderCreateView />;
}
