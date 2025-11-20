// app/api/whatsapp/send-message/route.ts
import { NextResponse } from 'next/server';
// import { whatsappClient } from '@/lib/whatsapp-client';

// Proxy logging to external backend when BACKEND_URL is configured.
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || '';

export async function POST(request: Request) {
  try {
    const { to, message, customerId } = await request.json();

    // If an external backend is configured, proxy the send to it.
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'No BACKEND_URL configured for sending messages' }, { status: 501 });
    }

    // Proxy sending request to external backend's WhatsApp endpoint
    const sendRes = await fetch(`${BACKEND_URL.replace(/\/$/, '')}/whatsapp/send`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ to, message, customerId }),
    });

    const result = await sendRes.json().catch(() => ({ status: sendRes.status }));

    // Log message in external backend if configured (skip if not)
    if (customerId && BACKEND_URL) {
      try {
        await fetch(`${BACKEND_URL.replace(/\/$/, '')}/messages`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            customerId,
            content: message,
            type: 'TEXT',
            direction: 'OUTBOUND',
            status: 'SENT',
          }),
        });
      } catch (e) {
        console.warn('Failed to log message to external backend:', e);
      }
    }

    // Log message in external backend (best-effort)
    if (customerId) {
      try {
        await fetch(`${BACKEND_URL.replace(/\/$/, '')}/messages`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            customerId,
            content: message,
            type: 'TEXT',
            direction: 'OUTBOUND',
            status: sendRes.ok ? 'SENT' : 'FAILED',
          }),
        });
      } catch (e) {
        console.warn('Failed to log message to external backend:', e);
      }
    }

    return NextResponse.json({ success: sendRes.ok, data: result }, { status: sendRes.status || 200 });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
