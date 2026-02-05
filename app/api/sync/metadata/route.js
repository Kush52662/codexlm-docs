import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get('project');
  const branch = searchParams.get('branch');

  if (!project || !branch) {
    return NextResponse.json(
      { error: 'Missing required parameters: project, branch' },
      { status: 400 }
    );
  }

  const metadataPath = path.join(process.cwd(), 'snapshots', project, branch, 'metadata.json');

  try {
    const content = await fs.readFile(metadataPath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
