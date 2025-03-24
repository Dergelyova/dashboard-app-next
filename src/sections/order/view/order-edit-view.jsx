'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EditOrder from '../form/edit-order';

// ----------------------------------------------------------------------

export function OrderEditView({ order }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Редагувати замовлення"
        links={[
          { name: 'Список замовлень', href: paths.dashboard.order },
          { name: `Замовлення #${order.id}`, href: paths.dashboard.order.details(order.id) },
          { name: 'Редагувати' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EditOrder order={order} />
    </DashboardContent>
  );
}
