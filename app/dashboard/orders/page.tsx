'use client';

import OrdersTable from '@/components/dashboard/OrdersTable';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrdersTable />
    </div>
  );
}
