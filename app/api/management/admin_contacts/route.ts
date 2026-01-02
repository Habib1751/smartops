import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

/**
 * GET /api/management/admin_contacts
 * List all admin WhatsApp contacts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    const role = searchParams.get('role');
    const is_active = searchParams.get('is_active');
    const is_primary = searchParams.get('is_primary');
    
    if (role) queryParams.append('role', role);
    if (is_active) queryParams.append('is_active', is_active);
    if (is_primary) queryParams.append('is_primary', is_primary);
    
    const queryString = queryParams.toString();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/admin_contacts${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔄 Fetching admin contacts from:', externalUrl);
    
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
    console.log('✅ Successfully fetched admin contacts');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching admin contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin contacts', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/management/admin_contacts
 * Create a new admin WhatsApp contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/admin_contacts`;
    
    console.log('🔄 Creating admin contact');
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
    console.log('✅ Successfully created admin contact');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error creating admin contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin contact', details: error.message },
      { status: 500 }
    );
  }
}
