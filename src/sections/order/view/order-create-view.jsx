'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import NewOrderForm from '../order-new-edit-form-old';

// ----------------------------------------------------------------------

export function OrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Створити нове замовлення"
        links={[
          { name: 'Список замовлень', href: paths.dashboard.root },
          { name: 'Нове замовлення' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NewOrderForm />
    </DashboardContent>
  );
}
