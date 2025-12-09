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
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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

