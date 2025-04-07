import prisma from '@/db/prisma';
import { auth } from '@/lib/auth';
import { encrypt } from '@/lib/encrypt';
import { databaseFormSchema } from '@/schema/zod';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const parsedData = databaseFormSchema.parse(body);
    if (!parsedData) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { name, host, port, username, password, dbName } = parsedData;

    // Check authentication
    const session = await auth();
    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Test database connection 
    const connectionUrl = `postgresql://${username}:${password}@${host}:${port}/${dbName}?sslmode=require`;
    const testPrisma = new PrismaClient({
      datasources: {
        db: { url: connectionUrl },
      },
    });

    try {
      await testPrisma.$connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      return NextResponse.json({ error: 'Database connection failed. Check your credentials.' }, { status: 400 });
    } finally {
      await testPrisma.$disconnect();
    }

    // Encrypt the password
    const encryptedPassword = encrypt(password);

    // Store the database entry
    const dbEntry = await prisma.database.create({
      data: {
        name,
        host,
        port: Number(port),
        username,
        password: encryptedPassword,
        dbName,
        userId: user.id,
      },
    });

    return NextResponse.json({ database: dbEntry }, { status: 201 });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
