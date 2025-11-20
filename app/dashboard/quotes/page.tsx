'use client';

import React, { useState } from 'react';
import { mockLeads, mockClients, mockPackageTemplates } from '@/data/mockData';
import { Download, Send, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuotesPage() {
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const getEventTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'sound_only': 'Sound Only',
      'sound_lighting': 'Sound + Lighting',
      'operation_only': 'Operation Only',
      'led_screens': 'LED Screens',
    };
    return types[type] || type;
  };

  const calculateQuote = (lead: any) => {
    const pkg = mockPackageTemplates.find((p) => p.package_type === lead.event_type);
    const basePrice = pkg?.base_price ?? 3500;
    const travelFee = 500; // Simplified
    const seasonalityMultiplier = 1.6;
    const client = mockClients.find((c) => c.client_id === lead.client_id);
    const loyaltyMultiplier = client?.loyalty_tier === 'vip' ? 0.9 : 1.0;
    const subtotal = (basePrice + travelFee) * seasonalityMultiplier * loyaltyMultiplier;
    const vat = subtotal * 0.18;
    const total = subtotal + vat;

    return { basePrice, travelFee, subtotal, vat, total, loyaltyMultiplier };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quotes Management</h1>
        <p className="text-gray-600 mt-1">Generate and manage quotes for leads</p>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Leads */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Available Leads</h2>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {mockLeads
              .filter((l) => l.lead_status !== 'won' && l.lead_status !== 'lost')
              .map((lead) => {
                const client = mockClients.find((c) => c.client_id === lead.client_id);
                const isSelected = selectedLead?.lead_id === lead.lead_id;
                return (
                  <button
                    key={lead.lead_id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{client?.name}</p>
                        <p className="text-sm text-gray-600">
                          {lead.event_location} • {lead.event_date}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {getEventTypeLabel(lead.event_type)}
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Quote Details */}
        {selectedLead ? (
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Quote Details</h2>

            {(() => {
              const client = mockClients.find((c) => c.client_id === selectedLead.client_id);
              const quote = calculateQuote(selectedLead);
              const pkg = mockPackageTemplates.find((p) => p.package_type === selectedLead.event_type);

              return (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold">{client?.name}</p>
                  </div>

                  {/* Service Type */}
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-semibold">{pkg?.package_name}</p>
                    <p className="text-xs text-gray-600 mt-1">{pkg?.description}</p>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-semibold">{selectedLead.event_date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="font-semibold">{selectedLead.event_location}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Base Package</span>
                      <span className="font-semibold">${quote.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Travel Fee</span>
                      <span>${quote.travelFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Seasonality (1.6x)</span>
                      <span>+60%</span>
                    </div>
                    {quote.loyaltyMultiplier < 1 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>VIP Loyalty</span>
                        <span>-10%</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Subtotal</span>
                      <span>${quote.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (18%)</span>
                      <span>${quote.vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${quote.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => toast.success('Quote copied to clipboard!')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                    <button
                      onClick={() => toast.success('Quote sent to client!')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 h-fit flex items-center justify-center text-gray-500">
            <p>Select a lead to view quote details</p>
          </div>
        )}
      </div>
    </div>
  );
}
