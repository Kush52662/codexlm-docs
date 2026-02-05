import { NextResponse } from 'next/server';
import { getSnapshotFile } from '@/lib/snapshots';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get('project');
  const branch = searchParams.get('branch');
  const commit = searchParams.get('commit');
  const filePathParam = searchParams.get('path');

  if (!project || !branch || !commit || !filePathParam) {
    return NextResponse.json(
      { error: 'Missing required parameters: project, branch, commit, path' },
      { status: 400 }
    );
  }

  const filePath = filePathParam.split('/').filter(Boolean);

  try {
    const fileData = await getSnapshotFile(project, branch, commit, filePath);

    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(fileData);
  } catch (error) {
    if (error.message.includes('Invalid path')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
