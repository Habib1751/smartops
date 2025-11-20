// app/api/inventory/route.ts
import { NextResponse } from 'next/server';

// This API route now proxies to an external backend when `BACKEND_URL` is configured.
// If you removed Prisma (as in this repo), set `BACKEND_URL` in Vercel (or your env)
// to point to your existing inventory backend (e.g. https://api.example.com).

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || '';

function backendNotConfiguredResponse() {
  return NextResponse.json(
    { error: 'Backend not configured. Set BACKEND_URL to your inventory backend.' },
    { status: 501 }
  );
}

export async function GET(request: Request) {
  if (!BACKEND_URL) return backendNotConfiguredResponse();

  try {
    // Proxy GET query params to external backend
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(`${BACKEND_URL.replace(/\/$/, '')}/inventory`);
    targetUrl.search = incomingUrl.search;

    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: { accept: 'application/json' },
    });

    const body = await res.text();
    return new NextResponse(body, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to proxy request to backend' }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!BACKEND_URL) return backendNotConfiguredResponse();

  try {
    const incomingUrl = new URL(request.url);
    const targetUrl = `${BACKEND_URL.replace(/\/$/, '')}/inventory`;

    // Forward body and headers
    const body = await request.text();
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });

    const respText = await res.text();
    return new NextResponse(respText, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to proxy POST to backend' }, { status: 502 });
  }
}
