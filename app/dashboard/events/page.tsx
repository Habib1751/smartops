'use client';

import React, { useState } from 'react';
import { mockEvents, mockClients, mockTechnicianAssignments, mockEquipment } from '@/data/mockData';
import { Search, ChevronDown, MapPin, Users, Zap, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [eventsState, setEventsState] = useState(() => mockEvents.map((e) => ({ ...e })));
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [invoiceEvent, setInvoiceEvent] = useState<any | null>(null);

  const filteredEvents = eventsState.filter((event) => {
    const client = mockClients.find((c) => c.client_id === event.client_id);
    const matchesSearch =
      (client?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.event_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.event_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.event_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all upcoming events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by event code, client, or location..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const client = mockClients.find((c) => c.client_id === event.client_id);
          const assignments = mockTechnicianAssignments.filter((a) => a.event_id === event.event_id);
          const isExpanded = expandedEvent === event.event_id;

          return (
            <div key={event.event_id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Summary */}
              <button
                onClick={() => setExpandedEvent(isExpanded ? null : event.event_id)}
                className="w-full px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.event_code}</h3>
                      <p className="text-sm text-gray-600">{client?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{event.event_location}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${event.total_price.toFixed(2)}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.event_status)}`}>
                        {event.event_status}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown size={20} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Details */}
              {isExpanded && (
                <div className="border-t bg-gray-50 px-6 py-4 space-y-4">
                  {/* Event Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-semibold">{event.event_date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold">{event.total_working_hours} hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Guests</p>
                      <p className="font-semibold">{event.estimated_guests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Event Type</p>
                      <p className="font-semibold">{event.event_type}</p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Pricing Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Package:</span>
                        <span>${event.base_package_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travel Fee:</span>
                        <span>${event.travel_fee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Seasonality Multiplier:</span>
                        <span>{(event.seasonality_multiplier).toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Subtotal:</span>
                        <span>${event.subtotal_before_vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (18%):</span>
                        <span>${event.vat_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>${event.total_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assignments */}
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Assigned Technicians ({assignments.length})</h4>
                    <div className="space-y-2">
                      {assignments.length === 0 ? (
                        <p className="text-sm text-gray-600">No technicians assigned</p>
                      ) : (
                        assignments.map((a) => (
                          <div key={a.assignment_id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{a.role_for_event}</p>
                              <p className="text-xs text-gray-600">Rate: ${a.agreed_rate}/hr</p>
                            </div>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {a.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Resources Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg ${event.technicians_assigned ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center gap-2">
                        <Users size={16} className={event.technicians_assigned ? 'text-green-600' : 'text-red-600'} />
                        <span className="text-sm font-semibold">
                          {event.technicians_assigned ? 'Techs Assigned' : 'No Techs'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${event.equipment_prepared ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center gap-2">
                        <Package size={16} className={event.equipment_prepared ? 'text-green-600' : 'text-red-600'} />
                        <span className="text-sm font-semibold">
                          {event.equipment_prepared ? 'Equipment' : 'No Equipment'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${event.transport_arranged ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className={event.transport_arranged ? 'text-green-600' : 'text-red-600'} />
                        <span className="text-sm font-semibold">
                          {event.transport_arranged ? 'Transport' : 'No Transport'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Edit Event
                    </button>
                    <button
                      onClick={() => {
                        setEventsState((prev) => prev.map((ev) => ev.event_id === event.event_id ? { ...ev, event_status: 'confirmed', confirmed_at: new Date().toISOString(), technicians_assigned: true } : ev));
                        toast.success('Event confirmed');
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      Confirm Event
                    </button>
                    <button
                      onClick={() => setInvoiceEvent(event)}
                      className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Event {editingEvent.event_code}</h3>
            <div className="space-y-3">
              <label className="block text-sm">Location</label>
              <input value={editingEvent.event_location} onChange={(e) => setEditingEvent((s:any)=>({...s, event_location: e.target.value}))} className="w-full border px-3 py-2 rounded" />

              <label className="block text-sm">Date</label>
              <input value={editingEvent.event_date} onChange={(e) => setEditingEvent((s:any)=>({...s, event_date: e.target.value}))} className="w-full border px-3 py-2 rounded" />

              <label className="block text-sm">Estimated Guests</label>
              <input type="number" value={editingEvent.estimated_guests} onChange={(e) => setEditingEvent((s:any)=>({...s, estimated_guests: Number(e.target.value)}))} className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingEvent(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => {
                setEventsState((prev) => prev.map((ev) => ev.event_id === editingEvent.event_id ? { ...ev, event_location: editingEvent.event_location, event_date: editingEvent.event_date, estimated_guests: editingEvent.estimated_guests } : ev));
                toast.success('Event updated');
                setEditingEvent(null);
              }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Invoice: {invoiceEvent.event_code}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Base Package</span><span>${invoiceEvent.base_package_price.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Travel Fee</span><span>${invoiceEvent.travel_fee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>${invoiceEvent.subtotal_before_vat.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>VAT</span><span>${invoiceEvent.vat_amount.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${invoiceEvent.total_price.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setInvoiceEvent(null)} className="px-4 py-2 border rounded">Close</button>
              <button onClick={() => { toast.success('Invoice downloaded'); setInvoiceEvent(null); }} className="px-4 py-2 bg-green-600 text-white rounded">Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
