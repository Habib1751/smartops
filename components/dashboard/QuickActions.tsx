"use client";

import React, { useState } from 'react';
import { mockLeads, mockPackageTemplates, mockTravelFeeZones } from '@/data/mockData';
import toast from 'react-hot-toast';

export default function QuickActions() {
  const [leads, setLeads] = useState(() => mockLeads.slice());
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [newLead, setNewLead] = useState({ client_id: '', event_location: '', event_date: '', event_type: '', priority_level: 'medium' });
  const [quoteLeadId, setQuoteLeadId] = useState<string | null>(null);

  function handleCreateLead() {
    if (!newLead.client_id || !newLead.event_location) return toast.error('Please provide required fields');
    const created = { ...newLead, lead_id: `lead-${Date.now()}` } as any;
    setLeads((s) => [created, ...s]);
    toast.success('Lead created');
    setNewLeadOpen(false);
    setNewLead({ client_id: '', event_location: '', event_date: '', event_type: '', priority_level: 'medium' });
  }

  function handleGenerateQuote() {
    if (!quoteLeadId) return toast.error('Select a lead first');
    // Simple mocked quote: pick package by lead.event_type
    const lead = leads.find((l) => l.lead_id === quoteLeadId) as any;
    const pkg = mockPackageTemplates.find((p) => p.package_type === lead?.event_type) || mockPackageTemplates[0];
    const travel = mockTravelFeeZones[0];
    const subtotal = (pkg.base_price + travel.fee_amount) * 1.6;
    const vat = subtotal * 0.18;
    const total = subtotal + vat;
    toast.success(`Quote: $${total.toFixed(2)} for lead ${lead?.lead_id}`);
    setQuoteOpen(false);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button onClick={() => setNewLeadOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">+ New Lead</button>
        <button onClick={() => setCreateEventOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Create Event</button>
        <button onClick={() => setQuoteOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">Generate Quote</button>
        <button onClick={() => toast('Opening reports...')} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm">View Reports</button>
      </div>

      {/* New Lead Modal */}
      {newLeadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Create New Lead</h3>
            <div className="space-y-2">
              <input placeholder="Client ID" value={newLead.client_id} onChange={(e) => setNewLead((s:any)=>({...s, client_id: e.target.value}))} className="w-full border px-3 py-2 rounded" />
              <input placeholder="Location" value={newLead.event_location} onChange={(e) => setNewLead((s:any)=>({...s, event_location: e.target.value}))} className="w-full border px-3 py-2 rounded" />
              <input placeholder="Date" value={newLead.event_date} onChange={(e) => setNewLead((s:any)=>({...s, event_date: e.target.value}))} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNewLeadOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleCreateLead} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal (simple) */}
      {createEventOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Create Event (mock)</h3>
            <p className="text-sm text-gray-600">This is a placeholder — connect to your Events creation flow to persist data.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setCreateEventOpen(false)} className="px-4 py-2 border rounded">Close</button>
              <button onClick={() => { toast.success('Event created (mock)'); setCreateEventOpen(false); }} className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Quote Modal */}
      {quoteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Generate Quote</h3>
            <select className="w-full border px-3 py-2 rounded mb-3" value={quoteLeadId ?? ''} onChange={(e) => setQuoteLeadId(e.target.value)}>
              <option value="">Select lead</option>
              {leads.map((l:any) => <option key={l.lead_id} value={l.lead_id}>{l.lead_id} — {l.event_location}</option>)}
            </select>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setQuoteOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleGenerateQuote} className="px-4 py-2 bg-purple-600 text-white rounded">Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
