import { CONFIG } from 'src/global-config';

import { OrderCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OrderCreateView />;
}
