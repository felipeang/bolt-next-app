import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ModuleLoader } from '@/lib/moduleLoader';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const modules = await prisma.module.findMany();
    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const module = await prisma.module.create({
      data: {
        name: body.name,
        path: body.path,
        enabled: body.enabled ?? true,
      },
    });
    
    // Reload modules after adding new one
    await ModuleLoader.getInstance().loadModules();
    
    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const module = await prisma.module.update({
      where: { id: body.id },
      data: { enabled: body.enabled },
    });
    
    // Reload modules after updating
    await ModuleLoader.getInstance().loadModules();
    
    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}