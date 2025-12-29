import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Check if this is a specific technician request or list
    const pathname = new URL(request.url).pathname;
    const technicianId = pathname.split('/').pop();
    
    let externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians`;
    
    if (technicianId && technicianId !== 'technicians') {
      // Specific technician
      externalUrl += `/${technicianId}`;
      if (queryString) externalUrl += `?${queryString}`;
    } else {
      // List of technicians
      if (queryString) externalUrl += `?${queryString}`;
    }
    
    console.log('🔄 Server-side proxying to external API:', externalUrl);
    
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('❌ External API returned error:', response.status, response.statusText);
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched technicians from external API');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error proxying technicians request:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch technicians from external API',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians`;
    
    console.log('🔄 Creating technician');
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
      throw new Error(`External API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully created technician');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error creating technician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create technician', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const pathname = new URL(request.url).pathname;
    const technicianId = pathname.split('/').pop();
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}`;
    
    const response = await fetch(externalUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error updating technician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update technician' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathname = new URL(request.url).pathname;
    const technicianId = pathname.split('/').pop();
    const softDelete = searchParams.get('soft_delete') !== 'false';
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}?soft_delete=${softDelete}`;
    
    const response = await fetch(externalUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error deleting technician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete technician' },
      { status: 500 }
    );
  }
}
