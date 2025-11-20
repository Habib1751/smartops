// data/mockData.ts - SmartOps Complete Mock Data matching DB Guide
// ============ CLIENTS ============
export const mockClients = [
  {
    client_id: 'cli-001',
    name: 'David Cohen',
    phone: '+972501234567',
    email: 'david@example.com',
    preferred_communication: 'whatsapp',
    loyalty_tier: 'premium',
    total_events_count: 5,
    total_revenue_generated: 45000,
    average_event_value: 9000,
    last_event_date: '2025-07-15',
    is_active: true,
  },
  {
    client_id: 'cli-002',
    name: 'Sara Levi',
    phone: '+972502234567',
    email: 'sara@example.com',
    preferred_communication: 'whatsapp',
    loyalty_tier: 'vip',
    total_events_count: 12,
    total_revenue_generated: 120000,
    average_event_value: 10000,
    last_event_date: '2025-08-20',
    is_active: true,
  },
  {
    client_id: 'cli-003',
    name: 'Yossi Menahem',
    phone: '+972503234567',
    email: 'yossi@example.com',
    preferred_communication: 'whatsapp',
    loyalty_tier: 'new',
    total_events_count: 1,
    total_revenue_generated: 8500,
    average_event_value: 8500,
    last_event_date: '2025-09-10',
    is_active: true,
  },
];

// ============ LEADS ============
export const mockLeads = [
  {
    lead_id: 'lead-001',
    client_id: 'cli-001',
    lead_source: 'whatsapp_group',
    lead_status: 'new',
    priority_level: 'high',
    event_type: 'sound_lighting',
    event_date: '2025-12-15',
    event_location: 'Haifa',
    estimated_guests: 200,
    technical_requirements: {
      event_subtype: 'wedding',
      indoor_outdoor: 'outdoor',
      stage_size: 'medium',
      special_requests: 'Need LED screens for backdrop',
    },
    missing_fields: ['load_in_time', 'technical_rider'],
    created_at: '2025-11-19T10:00:00Z',
    updated_at: '2025-11-19T10:00:00Z',
  },
  {
    lead_id: 'lead-002',
    client_id: 'cli-002',
    lead_source: 'direct_call',
    lead_status: 'contacted',
    priority_level: 'medium',
    event_type: 'sound_only',
    event_date: '2025-12-25',
    event_location: 'Tel Aviv',
    estimated_guests: 150,
    technical_requirements: {
      event_subtype: 'corporate_event',
      indoor_outdoor: 'indoor',
      stage_size: 'small',
    },
    missing_fields: [],
    created_at: '2025-11-18T14:30:00Z',
    updated_at: '2025-11-19T09:15:00Z',
  },
  {
    lead_id: 'lead-003',
    client_id: 'cli-003',
    lead_source: 'website_form',
    lead_status: 'new',
    priority_level: 'low',
    event_type: 'led_screens',
    event_date: '2026-01-10',
    event_location: 'Jerusalem',
    estimated_guests: 100,
    technical_requirements: {
      event_subtype: 'conference',
      indoor_outdoor: 'indoor',
      screen_count: 3,
    },
    missing_fields: ['budget_range', 'client_contact'],
    created_at: '2025-11-19T08:00:00Z',
    updated_at: '2025-11-19T08:00:00Z',
  },
];

// ============ EVENTS ============
export const mockEvents = [
  {
    event_id: 'evt-001',
    client_id: 'cli-001',
    lead_id: 'lead-001',
    event_code: 'EVT-2025-000001',
    event_type: 'sound_lighting',
    event_date: '2025-12-15',
    event_location: 'Haifa',
    distance_zone: 'zone_a',
    estimated_guests: 200,
    total_working_hours: 4.0,
    base_package_price: 4500,
    travel_fee: 500,
    seasonality_multiplier: 1.6,
    urgency_multiplier: 1.0,
    subtotal_before_vat: 8000,
    vat_amount: 1440,
    total_price: 9440,
    event_status: 'pending',
    technicians_assigned: true,
    equipment_prepared: true,
    transport_arranged: true,
    technical_requirements: {
      event_subtype: 'wedding',
      indoor_outdoor: 'outdoor',
      stage_size: 'medium',
    },
    created_at: '2025-11-19T10:00:00Z',
    confirmed_at: null,
  },
  {
    event_id: 'evt-002',
    client_id: 'cli-002',
    lead_id: 'lead-002',
    event_code: 'EVT-2025-000002',
    event_type: 'sound_only',
    event_date: '2025-12-25',
    event_location: 'Tel Aviv',
    distance_zone: 'zone_b',
    estimated_guests: 150,
    total_working_hours: 3.0,
    base_package_price: 3500,
    travel_fee: 300,
    seasonality_multiplier: 1.8,
    urgency_multiplier: 1.0,
    subtotal_before_vat: 6840,
    vat_amount: 1231.2,
    total_price: 8071.2,
    event_status: 'confirmed',
    technicians_assigned: true,
    equipment_prepared: false,
    transport_arranged: true,
    technical_requirements: {
      event_subtype: 'corporate_event',
      indoor_outdoor: 'indoor',
      stage_size: 'small',
    },
    created_at: '2025-11-18T14:30:00Z',
    confirmed_at: '2025-11-19T09:00:00Z',
  },
];

// ============ EQUIPMENT ============
export const mockEquipment = [
  {
    equipment_id: 'eq-001',
    equipment_name: 'Speaker Main',
    category_id: 'cat-sound',
    category_name: 'Sound System',
    quantity_total: 4,
    condition: 'good',
    last_maintenance_date: '2025-09-10',
    next_maintenance_date: '2025-12-10',
    is_active: true,
    assigned_count: 2,
  },
  {
    equipment_id: 'eq-002',
    equipment_name: 'Mixer Digital',
    category_id: 'cat-sound',
    category_name: 'Sound System',
    quantity_total: 3,
    condition: 'good',
    last_maintenance_date: '2025-08-15',
    next_maintenance_date: '2025-11-15',
    is_active: true,
    assigned_count: 1,
  },
  {
    equipment_id: 'eq-003',
    equipment_name: 'Moving Head Light',
    category_id: 'cat-lighting',
    category_name: 'Lighting',
    quantity_total: 12,
    condition: 'good',
    last_maintenance_date: '2025-10-01',
    next_maintenance_date: '2025-12-01',
    is_active: true,
    assigned_count: 4,
  },
  {
    equipment_id: 'eq-004',
    equipment_name: 'LED Screen Panel',
    category_id: 'cat-screens',
    category_name: 'LED Screens',
    quantity_total: 6,
    condition: 'good',
    last_maintenance_date: '2025-09-20',
    next_maintenance_date: '2025-12-20',
    is_active: true,
    assigned_count: 0,
  },
];

// ============ TECHNICIANS ============
export const mockTechnicians = [
  {
    technician_id: 'tech-001',
    name: 'Avi Rosen',
    phone: '+972509999111',
    email: 'avi@smartops.com',
    specialization: 'sound_engineer',
    hourly_rate: 300,
    is_available: true,
    total_events: 28,
    rating: 4.8,
  },
  {
    technician_id: 'tech-002',
    name: 'Moshe Katz',
    phone: '+972509999222',
    email: 'moshe@smartops.com',
    specialization: 'lighting_tech',
    hourly_rate: 250,
    is_available: true,
    total_events: 15,
    rating: 4.6,
  },
  {
    technician_id: 'tech-003',
    name: 'Sarah Nir',
    phone: '+972509999333',
    email: 'sarah@smartops.com',
    specialization: 'stage_manager',
    hourly_rate: 200,
    is_available: false,
    total_events: 8,
    rating: 4.9,
  },
  {
    technician_id: 'tech-004',
    name: 'Yosef Levi',
    phone: '+972509999444',
    email: 'yosef@smartops.com',
    specialization: 'loader',
    hourly_rate: 150,
    is_available: true,
    total_events: 40,
    rating: 4.7,
  },
];

// ============ TECHNICIAN ASSIGNMENTS ============
export const mockTechnicianAssignments = [
  {
    assignment_id: 'ta-001',
    event_id: 'evt-001',
    technician_id: 'tech-001',
    role_for_event: 'sound_engineer',
    call_time: '14:00:00',
    agreed_rate: 300,
    invitation_sent: true,
    status: 'accepted',
  },
  {
    assignment_id: 'ta-002',
    event_id: 'evt-001',
    technician_id: 'tech-002',
    role_for_event: 'lighting_tech',
    call_time: '14:00:00',
    agreed_rate: 250,
    invitation_sent: true,
    status: 'accepted',
  },
  {
    assignment_id: 'ta-003',
    event_id: 'evt-001',
    technician_id: 'tech-004',
    role_for_event: 'loader',
    call_time: '13:00:00',
    agreed_rate: 150,
    invitation_sent: true,
    status: 'pending',
  },
];

// ============ VEHICLES ============
export const mockVehicles = [
  {
    vehicle_id: 'veh-001',
    vehicle_type: 'van',
    plate_number: 'ABC-123',
    capacity_kg: 2000,
    is_available: true,
    last_service_date: '2025-10-15',
    next_service_date: '2025-12-15',
  },
  {
    vehicle_id: 'veh-002',
    vehicle_type: 'truck',
    plate_number: 'XYZ-789',
    capacity_kg: 5000,
    is_available: false,
    last_service_date: '2025-09-01',
    next_service_date: '2025-12-01',
  },
];

// ============ PRICING ============
export const mockPackageTemplates = [
  {
    package_id: 'pkg-001',
    package_type: 'sound_only',
    package_name: 'Sound Only',
    base_price: 3500,
    description: 'Professional sound system setup',
    includes: ['Main speakers', 'Mixer', 'Microphones', '2 hours setup'],
  },
  {
    package_id: 'pkg-002',
    package_type: 'sound_lighting',
    package_name: 'Sound + Lighting',
    base_price: 4500,
    description: 'Complete sound and lighting setup',
    includes: ['Sound system', 'Lighting rigs', 'Moving heads', '4 hours setup'],
  },
  {
    package_id: 'pkg-003',
    package_type: 'operation_only',
    package_name: 'Operation Only',
    base_price: 2500,
    description: 'Management and operation of existing equipment',
    includes: ['2 technicians', 'Event management', 'Technical support'],
  },
  {
    package_id: 'pkg-004',
    package_type: 'led_screens',
    package_name: 'LED Screens',
    base_price: 5500,
    description: 'LED screen rental and setup',
    includes: ['LED panels', 'Video control', 'Technical support'],
  },
];

export const mockTravelFeeZones = [
  {
    zone_id: 'zone-a',
    zone_name: 'Zone A (Close)',
    included_cities: ['Haifa', 'Acre', 'Nahariya'],
    fee_amount: 500,
  },
  {
    zone_id: 'zone-b',
    zone_name: 'Zone B (Medium)',
    included_cities: ['Tel Aviv', 'Rishon Lezion', 'Ramat Hasharon'],
    fee_amount: 300,
  },
  {
    zone_id: 'zone-c',
    zone_name: 'Zone C (Far)',
    included_cities: ['Jerusalem', 'Bethlehem', 'Ramallah'],
    fee_amount: 1000,
  },
];

export const mockPricingModifiers = [
  {
    modifier_id: 'mod-001',
    modifier_type: 'seasonality',
    modifier_name: 'Peak Season',
    season_months: [7, 8, 9, 12],
    multiplier: 1.6,
  },
  {
    modifier_id: 'mod-002',
    modifier_type: 'seasonality',
    modifier_name: 'Off Season',
    season_months: [1, 2, 6],
    multiplier: 0.85,
  },
  {
    modifier_id: 'mod-003',
    modifier_type: 'urgency',
    modifier_name: 'Urgent (< 7 days)',
    multiplier: 1.3,
  },
  {
    modifier_id: 'mod-004',
    modifier_type: 'loyalty',
    modifier_name: 'VIP Discount',
    loyalty_tier: 'vip',
    multiplier: 0.9,
  },
];

// ============ MESSAGES ============
export const mockMessages = [
  {
    message_id: 'msg-001',
    client_id: 'cli-001',
    lead_id: 'lead-001',
    channel: 'whatsapp',
    direction: 'inbound',
    content: 'Hi, I need sound and lighting for my wedding on July 15 in Haifa, around 200 guests.',
    sentiment: 'positive',
    responded_by: 'ai',
    response_time_seconds: 3,
    is_read: true,
    created_at: '2025-11-19T10:00:00Z',
  },
  {
    message_id: 'msg-002',
    client_id: 'cli-001',
    lead_id: 'lead-001',
    channel: 'whatsapp',
    direction: 'outbound',
    content: 'Great! Thanks for reaching out. Let me check our availability and get you a quote.',
    sentiment: null,
    responded_by: 'ai',
    response_time_seconds: 0,
    is_read: true,
    created_at: '2025-11-19T10:00:03Z',
  },
];

// ============ STATS ============
export const mockStats = {
  totalEvents: 84,
  pendingLeads: 12,
  confirmedEvents: 45,
  unreadMessages: 5,
  totalClients: 38,
  monthlyRevenue: 156000,
  availableTechs: 3,
  availableEquipment: 25,
  // Backwards-compatible stat names used in dashboard components
  totalProducts: 24,
  pendingOrders: 6,
  totalCustomers: 38,
};

// Backwards-compatible aliases and small helper mocks used by older components
// Some components expect different export names (mockCustomers, mockOrders, mockConversations, documents).
// Provide lightweight derived exports so imports remain stable for the UI.
export const mockCustomers = mockClients.map((c) => ({
  id: c.client_id,
  name: c.name,
  phone: c.phone,
  email: c.email,
  totalOrders: c.total_events_count,
  lastOrder: c.last_event_date,
}));

export const mockOrders = mockEvents.map((e) => ({
  id: e.event_id,
  orderNumber: e.event_code,
  customer: { name: (mockClients.find((c) => c.client_id === e.client_id) || { name: 'Unknown' }).name },
  status: e.event_status,
  totalAmount: e.total_price,
  createdAt: e.created_at || new Date().toISOString(),
}));

// Basic mockProducts used by inventory/dashboard components
export const mockProducts = [
  { id: 'prod-001', name: 'Speaker Model A', sku: 'SPK-A-001', quantity: 4, minStock: 2, category: 'Sound', warehouse: { id: 'wh-1', name: 'Main Warehouse' } },
  { id: 'prod-002', name: 'Mixer 16ch', sku: 'MIX-16-002', quantity: 1, minStock: 1, category: 'Sound', warehouse: { id: 'wh-1', name: 'Main Warehouse' } },
  { id: 'prod-003', name: 'Cable Pack', sku: 'CABL-PK-003', quantity: 50, minStock: 20, category: 'Accessories', warehouse: { id: 'wh-2', name: 'Secondary Warehouse' } },
  { id: 'prod-004', name: 'LED Panel', sku: 'LED-001', quantity: 6, minStock: 2, category: 'Screens', warehouse: { id: 'wh-1', name: 'Main Warehouse' } },
];

export const mockConversations = mockClients.map((c) => {
  const msgs = mockMessages.filter((m) => m.client_id === c.client_id).map((m) => ({
    id: m.message_id,
    text: m.content,
    time: m.created_at,
    sent: m.direction === 'outbound',
  }));

  const last = msgs[msgs.length - 1];

  return {
    id: c.client_id,
    name: c.name,
    phone: c.phone,
    lastMessage: last ? last.text : 'No messages yet',
    lastMessageTime: last ? last.time : null,
    unreadCount: msgs.filter((x) => !x.sent).length,
    messages: msgs,
  };
});

export const documents = [
  {
    id: 'doc-001',
    document_name: 'Invoice EVT-2025-000001',
    event_id: 'evt-001',
    document_type: 'invoice',
    file_url: '/docs/invoice-evt-001.pdf',
  },
  {
    id: 'doc-002',
    document_name: 'Technical Rider EVT-2025-000002',
    event_id: 'evt-002',
    document_type: 'rider',
    file_url: '/docs/rider-evt-002.pdf',
  },
];
