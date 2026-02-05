import { NextResponse } from 'next/server';
import { getConnectedProjects } from '@/lib/rag/retriever';

export async function GET() {
  try {
    const projects = await getConnectedProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to load projects' },
      { status: 500 }
    );
  }
}
