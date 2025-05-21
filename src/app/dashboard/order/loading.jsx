'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent>
      <LoadingScreen />
    </DashboardContent>
  );
}
