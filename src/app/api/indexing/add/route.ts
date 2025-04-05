import prisma from '@/db/prisma';
import { auth } from '@/lib/auth';
import { indexRequestSchema } from '@/schema/zod';
import { IndexParams } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData = indexRequestSchema.parse(body);
    if (!parsedData) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { targetAddr, indexType, databaseId, categoryId, cluster } = parsedData;

    const session = await auth();
    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate category enum
    if (!Object.values(IndexParams).includes(categoryId)) {
      return NextResponse.json({ error: 'Invalid category type' }, { status: 400 });
    }

    const indexRequest = await prisma.indexSettings.create({
      data: {
        targetAddr,
        indexType,
        userId: user.id,
        databaseId,
        indexParams: [categoryId],
        status: "PENDING",
        cluster,
      },
    });

    return NextResponse.json(indexRequest, { status: 201 });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
