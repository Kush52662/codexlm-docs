import { getSnapshotFile, getSnapshotTree } from '@/lib/snapshots';
import { notFound } from 'next/navigation';
import RepoViewer from '@/components/RepoViewer';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const filePath = resolvedParams.path.slice(3);
  return {
    title: `${filePath[filePath.length - 1] || 'Code Viewer'} - CodexLM Docs`
  };
}

export default async function CodeViewerPage({ params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path;
  
  if (!pathSegments || pathSegments.length < 4) {
    return <div>Invalid Path</div>;
  }

  const project = pathSegments[0];
  const branch = pathSegments[1];
  const commit = pathSegments[2];
  const filePath = pathSegments.slice(3);

  const [fileData, tree] = await Promise.all([
    getSnapshotFile(project, branch, commit, filePath),
    getSnapshotTree(project, branch, commit)
  ]);

  if (!fileData) {
    notFound();
  }

  
  return <RepoViewer params={resolvedParams} fileData={fileData} tree={tree} />;
}
