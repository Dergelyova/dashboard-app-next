import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = params;

  const { product } = await getProduct(id);

  return <ProductEditView product={product} />;
}

// ----------------------------------------------------------------------

async function getProduct(id) {
  const URL = id ? `${endpoints.product.details}?productId=${id}` : '';

  const res = await axios.get(URL);

  return res.data;
}

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 * Will remove in Next.js v15
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.product.list);

    return res.data.products.map((product) => ({ id: product.id }));
  }
  return [];
}
