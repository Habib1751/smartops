// app/api/whatsapp/send-message/route.ts
import { NextResponse } from 'next/server';
import { whatsappClient } from '@/lib/whatsapp';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { to, message, customerId } = await request.json();

    // Send WhatsApp message
    const result = await whatsappClient.sendMessage(to, message);

    // Log message in database
    if (customerId) {
      await prisma.message.create({
        data: {
          customerId,
          content: message,
          type: 'TEXT',
          direction: 'OUTBOUND',
          status: 'SENT',
        },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
