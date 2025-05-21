'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import NewOrder from '../form/new-order';

// ----------------------------------------------------------------------

export function OrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Створити нове замовлення"
        links={[
          { name: 'Список замовлень', href: paths.dashboard.order.root },
          { name: 'Нове замовлення' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NewOrder />
    </DashboardContent>
  );
}
