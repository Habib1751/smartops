import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalUrl = `${EXTERNAL_API_BASE}/api/management/assignments/bulk/send-invitations`;
    
    console.log('🔄 Sending bulk invitations');
    console.log('📦 Request data:', JSON.stringify(body, null, 2));
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
    console.log('✅ Successfully sent bulk invitations');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error sending bulk invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send bulk invitations', details: error.message },
      { status: 500 }
    );
  }
}
