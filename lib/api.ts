/**
 * Utility functions for making API requests
 * All requests go through local Next.js API routes which proxy to external API
 * This avoids CORS issues since the external API call happens server-side
 */

/**
 * Build the full API URL
 * Always use local API routes which proxy to external API server-side (avoids CORS)
 * @param endpoint - The API endpoint (e.g., '/api/leads', '/api/inventory')
 * @returns Full URL to the API endpoint
 */
export function buildApiUrl(endpoint: string): string {
  // Always use local routes - they will proxy to external API server-side
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  console.log('🔗 Using local proxy route:', path);
  return path;
}

/**
 * Fetch data from an API endpoint with error handling
 * @param endpoint - The API endpoint to fetch from
 * @param options - Fetch options (headers, method, etc.)
 * @returns Parsed JSON response or empty array on error
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const url = buildApiUrl(endpoint);
    console.log('🌐 Fetching from:', url);
    
    if (options?.body) {
      console.log('📤 Request body:', options.body);
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      // Try to get error details from response
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.error || errorData.details || errorData.message || '';
        console.error('❌ API error details:', errorData);
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          errorDetails = await response.text();
          console.error('❌ API error text:', errorDetails);
        } catch (e2) {
          console.error('❌ Could not parse error response');
        }
      }
      
      const errorMsg = errorDetails 
        ? `API error: ${response.status} - ${errorDetails}`
        : `API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    // Handle 204 No Content (successful DELETE with no response body)
    if (response.status === 204) {
      console.log('✅ Success (204 No Content)');
      return null as T;
    }

    const data = await response.json();
    console.log('📦 Response data:', data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch leads from the API
 * @param params - Query parameters for filtering leads
 */
export async function fetchLeads(params?: { search?: string; status?: string; priority?: string }) {
  let endpoint = '/api/leads';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  console.log('📞 fetchLeads called with endpoint:', endpoint);
  const response = await fetchApi(endpoint);
  console.log('📥 fetchLeads raw response:', response);
  
  const result = response?.data || response || [];
  console.log('✅ fetchLeads returning:', Array.isArray(result) ? `${result.length} items` : result);
  return result;
}

/**
 * Fetch messages from the API
 * @param leadId - Optional lead ID to filter messages
 */
export async function fetchMessages(leadId?: string) {
  const endpoint = leadId ? `/api/messages?lead_id=${leadId}` : '/api/messages';
  const response = await fetchApi(endpoint);
  return response?.data || response || [];
}

/**
 * Fetch inventory from the API
 * @param params - Query parameters for pagination and search
 */
export async function fetchInventory(params?: { limit?: number; offset?: number; q?: string }) {
  let endpoint = '/api/inventory';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.q) queryParams.append('q', params.q);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  const response = await fetchApi(endpoint);
  return response?.data || response || [];
}

/**
 * Create a new lead
 * @param leadData - Lead data to create
 */
export async function createLead(leadData: any) {
  return await fetchApi('/api/leads', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
}

/**
 * Create a new message
 * @param messageData - Message data to create
 */
export async function createMessage(messageData: any) {
  return await fetchApi('/api/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

/**
 * Create a new inventory item
 * @param inventoryData - Inventory data to create
 */
export async function createInventory(inventoryData: any) {
  return await fetchApi('/api/inventory', {
    method: 'POST',
    body: JSON.stringify(inventoryData),
  });
}

/**
 * Update an existing inventory item
 * @param equipmentId - ID of the equipment to update
 * @param updateData - Data to update
 */
export async function updateInventory(equipmentId: string, updateData: any) {
  return await fetchApi(`/api/inventory?equipment_id=${equipmentId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

/**
 * Delete an inventory item
 * @param equipmentId - ID of the equipment to delete
 */
export async function deleteInventory(equipmentId: string) {
  return await fetchApi(`/api/inventory?equipment_id=${equipmentId}`, {
    method: 'DELETE',
  });
}

// ==================== TECHNICIANS API ====================

/**
 * Fetch technicians from the API
 * @param params - Query parameters for filtering technicians
 */
export async function fetchTechnicians(params?: { 
  page?: number; 
  per_page?: number; 
  role?: string; 
  skill_level?: string; 
  is_active?: boolean; 
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  let endpoint = '/api/management/technicians';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.role) queryParams.append('role', params.role);
    if (params.skill_level) queryParams.append('skill_level', params.skill_level);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  const response = await fetchApi(endpoint);
  return response;
}

/**
 * Fetch a single technician by ID
 * @param id - Technician UUID
 */
export async function fetchTechnicianById(id: string) {
  return await fetchApi(`/api/management/technicians/${id}`);
}

/**
 * Create a new technician
 * @param technicianData - Technician data to create
 */
export async function createTechnician(technicianData: any) {
  return await fetchApi('/api/management/technicians', {
    method: 'POST',
    body: JSON.stringify(technicianData),
  });
}

/**
 * Update an existing technician
 * @param id - Technician UUID
 * @param updateData - Data to update
 */
export async function updateTechnician(id: string, updateData: any) {
  return await fetchApi(`/api/management/technicians/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

/**
 * Delete a technician
 * @param id - Technician UUID
 * @param softDelete - Whether to soft delete (default: true)
 */
export async function deleteTechnician(id: string, softDelete: boolean = true) {
  return await fetchApi(`/api/management/technicians/${id}?soft_delete=${softDelete}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch technician statistics
 * @param id - Technician UUID
 */
export async function fetchTechnicianStats(id: string) {
  return await fetchApi(`/api/management/technicians/${id}/stats`);
}

/**
 * Check technician availability
 * @param eventDate - Event date (YYYY-MM-DD)
 * @param role - Optional role filter
 * @param skillLevel - Optional skill level filter
 */
export async function checkTechnicianAvailability(eventDate: string, role?: string, skillLevel?: string) {
  let endpoint = `/api/management/technicians/availability/check?event_date=${eventDate}`;
  if (role) endpoint += `&role=${role}`;
  if (skillLevel) endpoint += `&skill_level=${skillLevel}`;
  return await fetchApi(endpoint);
}

/**
 * Fetch technician schedule
 * @param id - Technician UUID
 * @param fromDate - Start date (YYYY-MM-DD)
 * @param toDate - End date (YYYY-MM-DD)
 */
export async function fetchTechnicianSchedule(id: string, fromDate?: string, toDate?: string) {
  let endpoint = `/api/management/technicians/${id}/schedule`;
  const params = new URLSearchParams();
  if (fromDate) params.append('from_date', fromDate);
  if (toDate) params.append('to_date', toDate);
  const queryString = params.toString();
  if (queryString) endpoint += `?${queryString}`;
  return await fetchApi(endpoint);
}

// ==================== ASSIGNMENTS API ====================

/**
 * Fetch assignments from the API
 * @param params - Query parameters for filtering assignments
 */
export async function fetchAssignments(params?: {
  page?: number;
  per_page?: number;
  technician_id?: string;
  event_id?: string;
  payment_status?: string;
  attendance_status?: string;
  from_date?: string;
  to_date?: string;
}) {
  let endpoint = '/api/management/assignments';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.technician_id) queryParams.append('technician_id', params.technician_id);
    if (params.event_id) queryParams.append('event_id', params.event_id);
    if (params.payment_status) queryParams.append('payment_status', params.payment_status);
    if (params.attendance_status) queryParams.append('attendance_status', params.attendance_status);
    if (params.from_date) queryParams.append('from_date', params.from_date);
    if (params.to_date) queryParams.append('to_date', params.to_date);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  const response = await fetchApi(endpoint);
  return response;
}

/**
 * Fetch a single assignment by ID
 * @param id - Assignment UUID
 */
export async function fetchAssignmentById(id: string) {
  return await fetchApi(`/api/management/assignments/${id}`);
}

/**
 * Create a new assignment
 * @param assignmentData - Assignment data to create
 */
export async function createAssignment(assignmentData: any) {
  return await fetchApi('/api/management/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });
}

/**
 * Update an existing assignment
 * @param id - Assignment UUID
 * @param updateData - Data to update
 */
export async function updateAssignment(id: string, updateData: any) {
  return await fetchApi(`/api/management/assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

/**
 * Delete an assignment
 * @param id - Assignment UUID
 */
export async function deleteAssignment(id: string) {
  return await fetchApi(`/api/management/assignments/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Send invitations to multiple assignments in bulk
 * @param assignmentIds - Array of assignment UUIDs
 */
export async function bulkSendInvitations(assignmentIds: string[]) {
  return await fetchApi('/api/management/assignments/bulk/send-invitations', {
    method: 'POST',
    body: JSON.stringify({ assignment_ids: assignmentIds }),
  });
}

/**
 * Update payment status for multiple assignments in bulk
 * @param assignmentIds - Array of assignment UUIDs
 * @param paymentStatus - New payment status
 * @param paymentDate - Optional payment date
 */
export async function bulkUpdatePayment(
  assignmentIds: string[], 
  paymentStatus: string, 
  paymentDate?: string
) {
  return await fetchApi('/api/management/assignments/bulk/update-payment', {
    method: 'POST',
    body: JSON.stringify({ 
      assignment_ids: assignmentIds, 
      payment_status: paymentStatus,
      payment_date: paymentDate 
    }),
  });
}

/**
 * Fetch assignments for a specific event
 * @param eventId - Event UUID
 */
export async function fetchEventAssignments(eventId: string) {
  return await fetchApi(`/api/management/events/${eventId}/assignments`);
}

// ==================== REPORTS API ====================

/**
 * Fetch payroll report
 * @param fromDate - Start date (YYYY-MM-DD)
 * @param toDate - End date (YYYY-MM-DD)
 * @param paymentStatus - Optional payment status filter
 */
export async function fetchPayrollReport(
  fromDate: string, 
  toDate: string, 
  paymentStatus?: string
) {
  let endpoint = `/api/management/reports/payroll?from_date=${fromDate}&to_date=${toDate}`;
  if (paymentStatus) endpoint += `&payment_status=${paymentStatus}`;
  return await fetchApi(endpoint);
}

/**
 * Fetch performance report
 * @param fromDate - Start date (YYYY-MM-DD)
 * @param toDate - End date (YYYY-MM-DD)
 */
export async function fetchPerformanceReport(fromDate: string, toDate: string) {
  return await fetchApi(`/api/management/reports/performance?from_date=${fromDate}&to_date=${toDate}`);
}

/**
 * Fetch utilization report
 * @param fromDate - Start date (YYYY-MM-DD)
 * @param toDate - End date (YYYY-MM-DD)
 */
export async function fetchUtilizationReport(fromDate: string, toDate: string) {
  return await fetchApi(`/api/management/reports/utilization?from_date=${fromDate}&to_date=${toDate}`);
}

/**
 * Fetch upcoming crew report
 * @param daysAhead - Number of days to look ahead (default: 30)
 */
export async function fetchUpcomingCrewReport(daysAhead?: number) {
  let endpoint = '/api/management/reports/upcoming-crew';
  if (daysAhead) endpoint += `?days_ahead=${daysAhead}`;
  return await fetchApi(endpoint);
}

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardReport() {
  return await fetchApi('/api/management/reports/dashboard');
}

// ==================== ADMIN CONTACTS API ====================

/**
 * Fetch admin WhatsApp contacts from the API
 * @param params - Query parameters for filtering contacts
 */
export async function fetchAdminContacts(params?: {
  role?: string;
  is_active?: boolean;
  is_primary?: boolean;
}) {
  let endpoint = '/api/management/admin_contacts';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params.is_primary !== undefined) queryParams.append('is_primary', params.is_primary.toString());
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  const response = await fetchApi(endpoint);
  return response;
}

/**
 * Fetch a single admin contact by ID
 * @param id - Contact ID
 */
export async function fetchAdminContactById(id: number) {
  return await fetchApi(`/api/management/admin_contacts/${id}`);
}

/**
 * Create a new admin WhatsApp contact
 * @param contactData - Contact data to create
 */
export async function createAdminContact(contactData: any) {
  return await fetchApi('/api/management/admin_contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });
}

/**
 * Update an existing admin contact
 * @param id - Contact ID
 * @param updateData - Data to update
 */
export async function updateAdminContact(id: number, updateData: any) {
  return await fetchApi(`/api/management/admin_contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

/**
 * Delete an admin contact
 * @param id - Contact ID
 */
export async function deleteAdminContact(id: number) {
  return await fetchApi(`/api/management/admin_contacts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Fetch events with filtering, pagination, and search
 * @param params - Query parameters
 */
export async function fetchEvents(params?: {
  page?: number;
  per_page?: number;
  event_status?: string;
  event_type?: string;
  from_date?: string;
  to_date?: string;
  client_id?: string;
  lead_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  let endpoint = '/api/management/events';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.event_status) queryParams.append('event_status', params.event_status);
    if (params.event_type) queryParams.append('event_type', params.event_type);
    if (params.from_date) queryParams.append('from_date', params.from_date);
    if (params.to_date) queryParams.append('to_date', params.to_date);
    if (params.client_id) queryParams.append('client_id', params.client_id);
    if (params.lead_id) queryParams.append('lead_id', params.lead_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }
  
  const response = await fetchApi(endpoint);
  return response;
}

/**
 * Fetch a single event by ID
 * @param id - Event UUID
 */
export async function fetchEventById(id: string) {
  return await fetchApi(`/api/management/events/${id}`);
}

/**
 * Create a new event
 * @param eventData - Event data to create
 */
export async function createEvent(eventData: any) {
  return await fetchApi('/api/management/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
}

/**
 * Update an existing event
 * @param id - Event UUID
 * @param updateData - Data to update
 */
export async function updateEvent(id: string, updateData: any) {
  return await fetchApi(`/api/management/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

/**
 * Delete an event
 * @param id - Event UUID
 */
export async function deleteEvent(id: string) {
  return await fetchApi(`/api/management/events/${id}`, {
    method: 'DELETE',
  });
}

