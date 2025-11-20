'use client';

import React from 'react';
import { documents } from '@/data/mockData';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoices & Documents</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2">Document</th>
              <th className="py-2">Event ID</th>
              <th className="py-2">Type</th>
              <th className="py-2">File</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(d => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="py-3 text-sm">{d.document_name}</td>
                <td className="py-3 text-sm">{d.event_id}</td>
                <td className="py-3 text-sm">{d.document_type}</td>
                <td className="py-3 text-sm"><a className="text-blue-600" href={d.file_url}>View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
