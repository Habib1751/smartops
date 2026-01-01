import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments/${assignmentId}`;
    
    console.log('🔄 Server-side proxying to external API:', externalUrl);
    
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('❌ External API returned error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error details:', errorText);
      
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
    console.log('✅ Successfully fetched assignment from external API');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error proxying assignment request:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch assignment from external API',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments/${assignmentId}`;
    
    console.log('🔄 Updating assignment');
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
    console.log('✅ Successfully updated assignment');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error updating assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update assignment', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments/${assignmentId}`;
    
    console.log('🔄 Deleting assignment');
    console.log('🔗 DELETE URL:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'DELETE',
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

    // 204 No Content
    if (response.status === 204) {
      console.log('✅ Successfully deleted assignment');
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    console.log('✅ Successfully deleted assignment');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error deleting assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete assignment', details: error.message },
      { status: 500 }
    );
  }
}
