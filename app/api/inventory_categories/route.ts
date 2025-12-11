import { NextRequest, NextResponse } from 'next/server';

// External API base URL
const EXTERNAL_API_BASE = 'https://smartops-dev-cjc6cadne5gwfja3.israelcentral-01.azurewebsites.net';

/**
 * GET /api/inventory_categories
 * Fetches categories from external API with pagination and search
 * Query params: limit, offset, q (search query)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const q = searchParams.get('q') || '';
    
    // Build external API URL with params
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);
    if (q) params.append('q', q);
    
    const externalUrl = `${EXTERNAL_API_BASE}/api/inventory_categories?${params.toString()}`;
    
    const response = await fetch(externalUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch categories from external API' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('GET /api/inventory_categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory_categories
 * Create a new category
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('POST /api/inventory_categories - Request body:', body);
    
    const response = await fetch(`${EXTERNAL_API_BASE}/api/inventory_categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    console.log('POST /api/inventory_categories - Response:', response.status, data);
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('POST /api/inventory_categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inventory_categories
 * Full update of a category
 * Query param: category_id (required)
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'category_id is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const response = await fetch(
      `${EXTERNAL_API_BASE}/api/inventory_categories?category_id=${categoryId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('PUT /api/inventory_categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/inventory_categories
 * Partial update of a category
 * Query param: category_id (required)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'category_id is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const response = await fetch(
      `${EXTERNAL_API_BASE}/api/inventory_categories?category_id=${categoryId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('PATCH /api/inventory_categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory_categories
 * Delete a category
 * Query param: category_id (required)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    console.log('DELETE /api/inventory_categories - category_id:', categoryId);
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'category_id is required' },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${EXTERNAL_API_BASE}/api/inventory_categories?category_id=${categoryId}`,
      {
        method: 'DELETE',
      }
    );
    
    const data = await response.json();
    
    console.log('DELETE /api/inventory_categories - Response:', response.status, data);
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('DELETE /api/inventory_categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
