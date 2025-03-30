import prisma from '@/db';
import { auth } from '@/lib/auth';
import { indexRequestSchema } from '@/schema/zod';
import { NextRequest, NextResponse } from 'next/server';
import { Cluster, IndexCategory } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData = indexRequestSchema.parse(body);
    if (!parsedData) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { targetAddr, indexType, cluster, databaseId, categoryId, frequency } = parsedData;

    const session = await auth();
    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!Object.values(Cluster).includes(cluster)) {
      return NextResponse.json({ error: 'Invalid cluster type' }, { status: 400 });
    }

    // Validate category enum
    if (!Object.values(IndexCategory).includes(categoryId)) {
      return NextResponse.json({ error: 'Invalid category type' }, { status: 400 });
    }

    const indexRequest = await prisma.indexRequest.create({
      data: {
        targetAddr,
        indexType,
        userId: user.id,
        databaseId,
        category: categoryId,
        frequency,
        cluster,
      },
    });

    return NextResponse.json(indexRequest, { status: 201 });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
