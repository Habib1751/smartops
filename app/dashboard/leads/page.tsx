'use client';

import React, { useState } from 'react';
import { mockLeads, mockClients, mockPackageTemplates, mockTravelFeeZones } from '@/data/mockData';
import { Search, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const filteredLeads = mockLeads.filter((lead) => {
    const client = mockClients.find((c) => c.client_id === lead.client_id);
    const matchesSearch =
      (client?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.event_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.lead_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-1">Manage and convert leads to events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Event Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.map((lead) => {
                const client = mockClients.find((c) => c.client_id === lead.client_id);
                return (
                  <tr key={lead.lead_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{client?.name}</td>
                    <td className="px-6 py-4 text-sm">{lead.event_type}</td>
                    <td className="px-6 py-4 text-sm">{lead.event_date}</td>
                    <td className="px-6 py-4 text-sm">{lead.event_location}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getPriorityColor(lead.priority_level)}`}>
                        {lead.priority_level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.lead_status)}`}>
                        {lead.lead_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                        >
                          Generate Quote
                        </button>
                        <button
                          onClick={() => toast.success(`Message sent to ${client?.name}`)}
                          className="p-2 text-whatsapp-green hover:bg-green-50 rounded-lg"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Generator Modal */}
      {selectedLead && (
        <QuoteModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}

function QuoteModal({ lead, onClose }: any) {
  const [step, setStep] = useState('validate'); // validate or quote
  const client = mockClients.find((c) => c.client_id === lead.client_id);
  const selectedPackage = mockPackageTemplates.find((p) => p.package_type === lead.event_type);
  const travelZone = mockTravelFeeZones[0]; // Mocked zone

  const basePrice = selectedPackage?.base_price ?? 3500;
  const travelFee = travelZone.fee_amount;
  const seasonalityMultiplier = 1.6; // Peak season (July)
  const loyaltyMultiplier = client?.loyalty_tier === 'vip' ? 0.9 : 1.0;
  const subtotal = (basePrice + travelFee) * seasonalityMultiplier * loyaltyMultiplier;
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  // Availability validation (mocked)
  const availableTechs = 3;
  const techsNeeded = 3;
  const isAvailable = availableTechs >= techsNeeded;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">{step === 'validate' ? 'Validate Availability' : 'Quote Details'}</h2>

        {step === 'validate' ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-start gap-3 ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
              {isAvailable ? (
                <>
                  <div className="text-green-600 mt-1">✓</div>
                  <div>
                    <p className="font-semibold text-green-800">Availability Confirmed</p>
                    <p className="text-sm text-green-700">
                      Technicians: {availableTechs} available ({techsNeeded} needed)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-red-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-red-800">Insufficient Resources</p>
                    <p className="text-sm text-red-700">
                      Only {availableTechs} technicians available ({techsNeeded} needed)
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Equipment Available</p>
                <p className="font-semibold">25 items</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Vehicles Available</p>
                <p className="font-semibold">2 vehicles</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('quote')}
                disabled={!isAvailable}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  isAvailable
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Generate Quote
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-t border-b py-4">
              <div className="flex justify-between mb-2">
                <span>Base Package ({selectedPackage?.package_name})</span>
                <span className="font-semibold">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Travel Fee</span>
                <span>${travelFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Seasonality Multiplier (1.6x)</span>
                <span>+60%</span>
              </div>
              {loyaltyMultiplier < 1 && (
                <div className="flex justify-between mb-2 text-sm text-green-600">
                  <span>VIP Loyalty Discount</span>
                  <span>-10%</span>
                </div>
              )}
              <div className="flex justify-between font-semibold mt-4 pt-2 border-t">
                <span>Subtotal (before VAT)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>VAT (18%)</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t">
                <span>Total Price</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('validate')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => {
                  toast.success('Quote sent to client!');
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Send Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
