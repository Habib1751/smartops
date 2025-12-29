import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: technicianId } = await params;
    
    console.log('🔄 Fetching technician stats:', technicianId);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}/stats`;
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
      throw new Error(`External API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched technician stats');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching technician stats:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technician stats', details: error.message },
      { status: 500 }
    );
  }
}
