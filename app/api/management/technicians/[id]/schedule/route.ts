import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const technicianId = params.id;
    const { searchParams } = new URL(request.url);
    
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    
    console.log('🔄 Fetching technician schedule:', technicianId);
    
    let externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/${technicianId}/schedule`;
    const params_array: string[] = [];
    if (fromDate) params_array.push(`from_date=${fromDate}`);
    if (toDate) params_array.push(`to_date=${toDate}`);
    if (params_array.length > 0) {
      externalUrl += `?${params_array.join('&')}`;
    }
    
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
    console.log('✅ Successfully fetched technician schedule');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching technician schedule:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch technician schedule', details: error.message },
      { status: 500 }
    );
  }
}
