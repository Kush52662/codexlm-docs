const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(__dirname, '..');
const SNAPSHOTS_ROOT = path.join(DOCS_ROOT, 'snapshots');
const CONNECTORS_FILE = path.join(DOCS_ROOT, 'connectors.json');

function runGit(repoPath, command) {
  try {
    return execSync(`git -C "${repoPath}" ${command}`, { encoding: 'utf-8' }).trim();
  } catch (e) {
    console.error(`Error running git command: git -C "${repoPath}" ${command}`);
    throw e;
  }
}

async function sync() {
  if (!fs.existsSync(CONNECTORS_FILE)) {
    console.error(`Connectors file not found: ${CONNECTORS_FILE}`);
    return;
  }

  const connectors = JSON.parse(fs.readFileSync(CONNECTORS_FILE, 'utf-8'));

  for (const project of connectors) {
    const { projectId, repoPath } = project;
    console.log(`Syncing project: ${projectId} from ${repoPath}`);

    if (!fs.existsSync(repoPath)) {
      console.error(`Repo path does not exist: ${repoPath}`);
      continue;
    }

    try {
      const branch = runGit(repoPath, 'rev-parse --abbrev-ref HEAD');
      const commitSha = runGit(repoPath, 'rev-parse HEAD');
      const isDirty = runGit(repoPath, 'status --porcelain') !== '';

      const projectBranchDir = path.join(SNAPSHOTS_ROOT, projectId, branch);
      const targetDir = path.join(projectBranchDir, commitSha);
      const latestDir = path.join(projectBranchDir, 'latest');

      // 1. Create canonical snapshot if it doesn't exist (only on commit)
      if (!fs.existsSync(targetDir)) {
        console.log(`Creating canonical snapshot for commit ${commitSha}...`);
        fs.mkdirSync(targetDir, { recursive: true });
        execSync(`rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.next' "${repoPath}/" "${targetDir}/"`, { stdio: 'ignore' });
      }

      // 2. Always update 'latest' directory (the "draft" or most recent state)
      if (!fs.existsSync(latestDir)) {
        fs.mkdirSync(latestDir, { recursive: true });
      }
      console.log(`Updating 'latest' directory for ${projectId}...`);
      execSync(`rsync -av --delete --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='.next' "${repoPath}/" "${latestDir}/"`, { stdio: 'inherit' });

      // Update metadata
      const metadata = {
        projectId,
        repoPath,
        branch,
        commitSha,
        isDirty,
        indexedAt: new Date().toISOString()
      };
      fs.writeFileSync(path.join(projectBranchDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
      console.log(`Metadata updated for ${projectId}/${branch}`);

      // 3. Update app/page.mdx if this is the primary connector (first one)
      if (project === connectors[0]) {
        const readmePath = path.join(latestDir, 'README.md');
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, 'utf-8');
          // Convert HTML comments to MDX comments
          const mdxContent = readmeContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
          const appPagePath = path.join(DOCS_ROOT, 'app', 'page.mdx');
          fs.writeFileSync(appPagePath, mdxContent);
          console.log(`Updated app/page.mdx from ${projectId} README`);
        }
      }

    } catch (err) {
      console.error(`Error syncing project ${projectId}:`, err);
    }
  }
}

sync();
