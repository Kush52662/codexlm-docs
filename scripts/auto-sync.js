const chokidar = require('chokidar');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.join(__dirname, '..');
const CONNECTORS_FILE = path.join(DOCS_ROOT, 'connectors.json');
const SYNC_SCRIPT = path.join(__dirname, 'sync-snapshot.js');

function runSync() {
  console.log(`[${new Date().toLocaleTimeString()}] Running sync...`);
  try {
    execSync(`node "${SYNC_SCRIPT}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Sync failed');
  }
}

function getGitInfo(repoPath) {
  try {
    const branch = execSync(`git -C "${repoPath}" rev-parse --abbrev-ref HEAD`, { encoding: 'utf-8' }).trim();
    const commitSha = execSync(`git -C "${repoPath}" rev-parse HEAD`, { encoding: 'utf-8' }).trim();
    const isDirty = execSync(`git -C "${repoPath}" status --porcelain`, { encoding: 'utf-8' }).trim() !== '';
    return { branch, commitSha, isDirty };
  } catch (e) {
    return null;
  }
}

async function start() {
  if (!fs.existsSync(CONNECTORS_FILE)) {
    console.error('No connectors.json found');
    process.exit(1);
  }

  const connectors = JSON.parse(fs.readFileSync(CONNECTORS_FILE, 'utf-8'));

  for (const project of connectors) {
    const { projectId, repoPath } = project;
    console.log(`Watching ${projectId} at ${repoPath}`);

    let currentGit = getGitInfo(repoPath);

    // 1. File Watcher
    const watcher = chokidar.watch(repoPath, {
      ignored: [
        /(^|[\/\\])\../, 
        '**/node_modules/**', 
        '**/dist/**', 
        '**/.next/**',
        '**/.git/**'
      ],
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('all', (event, filePath) => {
      console.log(`File change: ${event} ${path.relative(repoPath, filePath)}`);
      runSync();
    });

    // 2. Git Polling (every 5 seconds)
    setInterval(() => {
      const newGit = getGitInfo(repoPath);
      if (!newGit) return;

      if (!currentGit || newGit.commitSha !== currentGit.commitSha || newGit.branch !== currentGit.branch) {
        console.log(`Git state changed: ${currentGit?.commitSha} -> ${newGit.commitSha}`);
        currentGit = newGit;
        runSync();
      }
    }, 5000);
  }

  // Initial sync
  runSync();
}

start();
