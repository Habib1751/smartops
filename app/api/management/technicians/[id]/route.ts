import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: technicianId } = await params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    let externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}`;
    if (queryString) externalUrl += `?${queryString}`;
    
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error fetching technician:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technician', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id: technicianId } = await params;
    
    console.log('🔄 Updating technician:', technicianId);
    console.log('📦 Update data:', JSON.stringify(body, null, 2));
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}`;
    console.log('🔗 PATCH URL:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'PATCH',
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
    console.log('✅ Successfully updated technician');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error updating technician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update technician', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: technicianId } = await params;
    const { searchParams } = new URL(request.url);
    const softDelete = searchParams.get('soft_delete') !== 'false';
    
    console.log('🔄 Deleting technician:', technicianId, 'Soft delete:', softDelete);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}?soft_delete=${softDelete}`;
    console.log('🔗 DELETE URL:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'DELETE',
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok && response.status !== 204) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      throw new Error(`External API error: ${response.status} - ${errorText}`);
    }

    if (response.status === 204) {
      console.log('✅ Successfully deleted technician (204 No Content)');
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    console.log('✅ Successfully deleted technician');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error deleting technician:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete technician', details: error.message },
      { status: 500 }
    );
  }
}
