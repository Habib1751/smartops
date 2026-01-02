import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    // Get query params from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Build external API URL
    const externalUrl = `${EXTERNAL_API_BASE}/api/messages${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔄 Server-side proxying messages to external API:', externalUrl);
    
    // Fetch from external API (server-side, no CORS issues)
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
    console.log('✅ Successfully fetched', data.data?.length || 0, 'messages from external API');
    
    // Return the data as-is from external API
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error proxying messages request:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages from external API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Proxy POST request to external API
    const externalUrl = `${EXTERNAL_API_BASE}/api/messages`;
    
    console.log('🔄 Proxying POST message to external API:', externalUrl);
    
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
