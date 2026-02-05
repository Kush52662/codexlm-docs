import fs from 'fs/promises';
import path from 'path';

const SNAPSHOTS_DIR = path.join(process.cwd(), 'snapshots');

export async function getSnapshotFile(project, branch, commit, filePath) {
  // Construct the full path
  // Structure: snapshots/<project>/<branch>/<commit>/<filePath>
  const relativePath = path.join(project, branch, commit, ...filePath);
  const fullPath = path.join(SNAPSHOTS_DIR, relativePath);

  // Security check: Prevent path traversal
  const resolvedPath = path.resolve(fullPath);
  if (!resolvedPath.startsWith(SNAPSHOTS_DIR)) {
    throw new Error('Invalid path: Path traversal detected');
  }

  try {
    const stat = await fs.stat(resolvedPath);
    if (!stat.isFile()) {
      throw new Error('Not a file');
    }

    const content = await fs.readFile(resolvedPath, 'utf-8');
    
    // Mock indexed_at for now, could be file mtime
    const indexedAt = stat.mtime.toISOString();

    return {
      content,
      metadata: {
        project,
        branch,
        commit,
        indexed_at: indexedAt,
        size: stat.size,
        path: filePath.join('/')
      }
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function getSnapshotTree(project, branch, commit) {
  const snapshotDir = path.join(SNAPSHOTS_DIR, project, branch, commit);
  const tree = [];

  async function walk(dir, relativePath = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.next' || entry.name === '.DS_Store') continue;
      
      const newPath = [...relativePath, entry.name];
      if (entry.isDirectory()) {
        const children = await walk(path.join(dir, entry.name), newPath);
        tree.push({
          name: entry.name,
          type: 'directory',
          path: newPath.join('/'),
          children: children.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
          })
        });
      } else {
        tree.push({
          name: entry.name,
          type: 'file',
          path: newPath.join('/')
        });
      }
    }
    return tree;
  }

  try {
    const rootTree = [];
    async function walkRecursive(dir, relativePath = []) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const items = [];
      for (const entry of entries) {
        if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.next' || entry.name === '.DS_Store') continue;
        
        const newPath = [...relativePath, entry.name];
        if (entry.isDirectory()) {
          items.push({
            name: entry.name,
            type: 'directory',
            path: newPath.join('/'),
            children: await walkRecursive(path.join(dir, entry.name), newPath)
          });
        } else {
          items.push({
            name: entry.name,
            type: 'file',
            path: newPath.join('/')
          });
        }
      }
      return items.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
    }

    return await walkRecursive(snapshotDir);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}
