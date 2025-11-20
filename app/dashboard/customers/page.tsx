'use client';

import CustomersTable from '@/components/dashboard/CustomersTable';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomersTable />
    </div>
  );
}
