import { NextRequest, NextResponse } from 'next/server';

// Use server-side env variable (no NEXT_PUBLIC prefix) to hide from browser
const EXTERNAL_API_BASE = process.env.BACKEND_API_URL || 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

export async function GET(request: NextRequest) {
  try {
    // Get query params from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Build external API URL
    const externalUrl = `${EXTERNAL_API_BASE}/api/leads${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔄 Server-side proxying to external API:', externalUrl);
    
    // Fetch from external API (server-side, no CORS issues)
    const response = await fetch(externalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache to always get fresh data
    });

    if (!response.ok) {
      console.error('❌ External API returned error:', response.status, response.statusText);
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched', data.data?.length || 0, 'leads from external API');
    
    // Return the data as-is from external API
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('❌ Error proxying leads request:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leads from external API',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Proxy POST request to external API
    const externalUrl = `${EXTERNAL_API_BASE}/api/leads`;
    
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
    console.error('❌ Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
