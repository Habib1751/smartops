import { NextRequest, NextResponse } from 'next/server';

// External API base URL
const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipment_id');
    
    // If equipment_id is provided, fetch single equipment details
    if (equipmentId) {
      const externalUrl = `${EXTERNAL_API_BASE}/api/inventory?equipment_id=${equipmentId}`;
      console.log('🔗 Proxying to (single equipment):', externalUrl);
      
      const response = await fetch(externalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('❌ External API error:', response.status, response.statusText);
        return NextResponse.json(
          { error: 'Failed to fetch equipment details from external API', status: response.status },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      console.log('✅ Equipment details fetched successfully for ID:', equipmentId);
      return NextResponse.json(data);
    }
    
    // Otherwise, fetch list with pagination and search
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const q = searchParams.get('q') || '';
    
    // Build external API URL with params
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);
    if (q) params.append('q', q);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/inventory?${params.toString()}`;
    console.log('🔗 Proxying to:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('❌ External API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch inventory from external API', status: response.status },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Inventory fetched successfully, items:', data.data?.length || 0);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory
 * Creates new inventory item
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📤 Creating inventory item:', body);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/inventory`;
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ External API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create inventory item', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Inventory item created successfully');
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inventory
 * Updates existing inventory item
 * Query param: equipment_id
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipment_id');
    
    if (!equipmentId) {
      return NextResponse.json(
        { error: 'equipment_id query parameter is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('📝 Updating inventory item:', equipmentId, body);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/inventory?equipment_id=${equipmentId}`;
    const response = await fetch(externalUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ External API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to update inventory item', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Inventory item updated successfully');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory
 * Deletes inventory item
 * Query param: equipment_id
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipment_id');
    
    if (!equipmentId) {
      return NextResponse.json(
        { error: 'equipment_id query parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('🗑️ Deleting inventory item:', equipmentId);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/inventory?equipment_id=${equipmentId}`;
    const response = await fetch(externalUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ External API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to delete inventory item', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Inventory item deleted successfully');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
