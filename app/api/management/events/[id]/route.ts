import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

/**
 * GET /api/management/events/[id]
 * Get a single event by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/events/${id}`;

    console.log('🔄 Fetching event from:', externalUrl);

    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      return NextResponse.json(
        { error: errorText || `Failed to fetch event: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched event');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error in GET /api/management/events/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/management/events/[id]
 * Update an existing event (partial update)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('🔄 Updating event:', id);
    console.log('📦 Update data:', JSON.stringify(body, null, 2));

    const externalUrl = `${EXTERNAL_API_BASE}/api/management/events/${id}`;
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
      return NextResponse.json(
        { error: errorText || `Failed to update event: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully updated event');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error in PATCH /api/management/events/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/management/events/[id]
 * Delete an event
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🔄 Deleting event:', id);

    const externalUrl = `${EXTERNAL_API_BASE}/api/management/events/${id}`;
    console.log('🔗 DELETE URL:', externalUrl);

    const response = await fetch(externalUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 External API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error response:', errorText);
      return NextResponse.json(
        { error: errorText || `Failed to delete event: ${response.statusText}` },
        { status: response.status }
      );
    }

    // DELETE returns 204 No Content
    console.log('✅ Successfully deleted event');
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/management/events/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
