import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const eventDate = searchParams.get('event_date');
    const role = searchParams.get('role');
    const skillLevel = searchParams.get('skill_level');
    
    if (!eventDate) {
      return NextResponse.json(
        { success: false, error: 'event_date parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('🔄 Checking technician availability for:', eventDate);
    
    let externalUrl = `${EXTERNAL_API_BASE}/api/management/technicians/availability/check?event_date=${eventDate}`;
    if (role) externalUrl += `&role=${role}`;
    if (skillLevel) externalUrl += `&skill_level=${skillLevel}`;
    
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
    console.log('✅ Successfully checked technician availability');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error checking technician availability:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to check technician availability', details: error.message },
      { status: 500 }
    );
  }
}
