// app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { sku: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          supplier: true,
          warehouse: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const product = await prisma.product.create({
      data: {
        ...data,
        price: parseFloat(data.price),
        costPrice: parseFloat(data.costPrice),
      },
    });

    // Create stock movement record
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: 'IN',
        quantity: data.quantity,
        reason: 'Initial stock',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
