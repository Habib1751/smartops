import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query parameters according to Events Management API documentation
    const queryParams = new URLSearchParams();
    const page = searchParams.get('page');
    const per_page = searchParams.get('per_page');
    const event_status = searchParams.get('event_status');
    const event_type = searchParams.get('event_type');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');
    const client_id = searchParams.get('client_id');
    const lead_id = searchParams.get('lead_id');
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by');
    const sort_order = searchParams.get('sort_order');
    
    if (page) queryParams.append('page', page);
    if (per_page) queryParams.append('per_page', per_page);
    if (event_status) queryParams.append('event_status', event_status);
    if (event_type) queryParams.append('event_type', event_type);
    if (from_date) queryParams.append('from_date', from_date);
    if (to_date) queryParams.append('to_date', to_date);
    if (client_id) queryParams.append('client_id', client_id);
    if (lead_id) queryParams.append('lead_id', lead_id);
    if (search) queryParams.append('search', search);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (sort_order) queryParams.append('sort_order', sort_order);
    
    const queryString = queryParams.toString();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/events${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔄 Fetching events from:', externalUrl);
    
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched events');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/events`;
    
    console.log('🔄 Creating event');
    console.log('📦 Create data:', JSON.stringify(body, null, 2));
    console.log('🔗 POST URL:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully created event');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event', details: error.message },
      { status: 500 }
    );
  }
}
