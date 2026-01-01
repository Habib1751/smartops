import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    let externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments`;
    if (queryString) externalUrl += `?${queryString}`;
    
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
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched assignments from external API');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error proxying assignments request:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch assignments from external API',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments`;
    
    console.log('🔄 Creating assignment');
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
      
      // Try to parse error as JSON, otherwise use text
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
    console.log('✅ Successfully created assignment');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error creating assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create assignment', details: error.message },
      { status: 500 }
    );
  }
}
