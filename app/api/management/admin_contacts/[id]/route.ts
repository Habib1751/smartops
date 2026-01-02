import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

/**
 * GET /api/management/admin_contacts/[id]
 * Get a single admin contact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/admin_contacts/${id}`;
    
    console.log('🔄 Fetching admin contact:', id);
    console.log('🔗 GET URL:', externalUrl);
    
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
    console.log('✅ Successfully fetched admin contact');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error fetching admin contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin contact', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/management/admin_contacts/[id]
 * Update an existing admin contact (partial update)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/admin_contacts/${id}`;
    
    console.log('🔄 Updating admin contact:', id);
    console.log('📦 Update data:', JSON.stringify(body, null, 2));
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
    console.log('✅ Successfully updated admin contact');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error updating admin contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin contact', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/management/admin_contacts/[id]
 * Delete an admin contact
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/admin_contacts/${id}`;
    
    console.log('🔄 Deleting admin contact:', id);
    console.log('🔗 DELETE URL:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok && response.status !== 204) {
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

    console.log('✅ Successfully deleted admin contact');
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('❌ Error deleting admin contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin contact', details: error.message },
      { status: 500 }
    );
  }
}
