import fs from 'fs/promises';
import path from 'path';

const CONNECTORS_PATH = path.join(process.cwd(), 'connectors.json');
const SNAPSHOTS_ROOT = path.join(process.cwd(), 'snapshots');

const MAX_FILE_BYTES = 256 * 1024;
const DEFAULT_MAX_FILES = 1200;
const DEFAULT_CHUNK_LINES = 80;
const DEFAULT_CHUNK_OVERLAP = 20;
const DEFAULT_MAX_CHARS_PER_CHUNK = 2400;

const TEXT_EXTENSIONS = new Set([
  '.js', '.cjs', '.mjs', '.jsx', '.ts', '.tsx',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift', '.php',
  '.html', '.css', '.scss', '.sass', '.less',
  '.json', '.jsonl', '.yaml', '.yml', '.toml', '.ini', '.env',
  '.md', '.mdx', '.txt', '.rst', '.sql', '.graphql', '.gql',
  '.sh', '.zsh', '.bash', '.ps1', '.dockerfile', '.makefile',
  '.xml', '.svg'
]);

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache'
]);

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'of', 'on', 'or', 's', 'that',
  'the', 'their', 'this', 'to', 'what', 'when', 'where', 'which', 'who', 'why',
  'with', 'you', 'your'
]);

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_./-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(query) {
  const words = normalize(query)
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w && w.length >= 2 && !STOPWORDS.has(w));
  return [...new Set(words)].slice(0, 24);
}

async function safeReadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getConnectedProjects() {
  const connectors = await safeReadJson(CONNECTORS_PATH);
  if (!Array.isArray(connectors)) {
    return [];
  }

  return connectors
    .filter((c) => c && c.projectId && c.repoPath)
    .map((c) => ({
      projectId: c.projectId,
      repoPath: c.repoPath,
      defaultBranch: c.defaultBranch || 'main'
    }));
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveCodeSource({ projectId, branch }) {
  const projects = await getConnectedProjects();
  const selected = projectId
    ? projects.find((p) => p.projectId === projectId)
    : projects[0];

  if (!selected) {
    throw new Error('No connected projects found in connectors.json');
  }

  const effectiveBranch = branch || selected.defaultBranch || 'main';

  const latestPath = path.join(SNAPSHOTS_ROOT, selected.projectId, effectiveBranch, 'latest');
  if (await pathExists(latestPath)) {
    return {
      projectId: selected.projectId,
      branch: effectiveBranch,
      rootPath: latestPath,
      sourceType: 'snapshot_latest',
      commit: 'latest',
      repoPath: selected.repoPath
    };
  }

  const metadataPath = path.join(SNAPSHOTS_ROOT, selected.projectId, effectiveBranch, 'metadata.json');
  const metadata = await safeReadJson(metadataPath);
  if (metadata?.commitSha) {
    const commitPath = path.join(SNAPSHOTS_ROOT, selected.projectId, effectiveBranch, metadata.commitSha);
    if (await pathExists(commitPath)) {
      return {
        projectId: selected.projectId,
        branch: effectiveBranch,
        rootPath: commitPath,
        sourceType: 'snapshot_commit',
        commit: metadata.commitSha,
        repoPath: selected.repoPath,
        snapshotMetadata: metadata
      };
    }
  }

  if (await pathExists(selected.repoPath)) {
    return {
      projectId: selected.projectId,
      branch: effectiveBranch,
      rootPath: selected.repoPath,
      sourceType: 'repo_path',
      commit: null,
      repoPath: selected.repoPath
    };
  }

  throw new Error(`Unable to resolve code source for project '${selected.projectId}'`);
}

function shouldSkipDir(name) {
  return IGNORED_DIRS.has(name) || name.startsWith('.');
}

function shouldIncludeFile(filePath) {
  const base = path.basename(filePath).toLowerCase();
  const ext = path.extname(base).toLowerCase();

  if (base === 'dockerfile' || base === 'makefile') {
    return true;
  }

  return TEXT_EXTENSIONS.has(ext);
}

async function collectFiles(rootPath, maxFiles = DEFAULT_MAX_FILES) {
  const queue = [rootPath];
  const files = [];

  while (queue.length > 0 && files.length < maxFiles) {
    const current = queue.shift();
    const entries = await fs.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!shouldSkipDir(entry.name)) {
          queue.push(fullPath);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!shouldIncludeFile(fullPath)) {
        continue;
      }

      files.push(fullPath);
      if (files.length >= maxFiles) {
        break;
      }
    }
  }

  return files;
}

function isLikelyBinary(buffer) {
  const sampleSize = Math.min(buffer.length, 1024);
  for (let i = 0; i < sampleSize; i += 1) {
    if (buffer[i] === 0) {
      return true;
    }
  }
  return false;
}

function chunkLines(lines, config = {}) {
  const chunkSize = config.chunkLines || DEFAULT_CHUNK_LINES;
  const overlap = config.chunkOverlap || DEFAULT_CHUNK_OVERLAP;
  const maxChars = config.maxCharsPerChunk || DEFAULT_MAX_CHARS_PER_CHUNK;

  const chunks = [];
  let start = 0;

  while (start < lines.length) {
    const end = Math.min(start + chunkSize, lines.length);
    const slice = lines.slice(start, end);

    let text = slice.join('\n');
    if (text.length > maxChars) {
      text = text.slice(0, maxChars);
    }

    chunks.push({
      startLine: start + 1,
      endLine: end,
      text
    });

    if (end >= lines.length) {
      break;
    }

    start = Math.max(start + chunkSize - overlap, start + 1);
  }

  return chunks;
}

function scoreChunk({ query, queryTokens, filePath, content }) {
  const normalizedPath = normalize(filePath);
  const normalizedContent = normalize(content);

  let score = 0;

  for (const token of queryTokens) {
    let termHits = 0;
    if (normalizedContent.includes(token)) {
      termHits += 1;
      const freq = normalizedContent.split(token).length - 1;
      termHits += Math.min(freq, 6) * 0.2;
    }

    if (normalizedPath.includes(token)) {
      termHits += 1.5;
    }

    if (path.basename(normalizedPath).includes(token)) {
      termHits += 1;
    }

    score += termHits;
  }

  const normalizedQuery = normalize(query);
  if (normalizedQuery && normalizedContent.includes(normalizedQuery)) {
    score += 3;
  }

  if (/readme|overview|architecture|guide/.test(normalizedPath)) {
    score += 0.4;
  }

  return score;
}

export async function retrieveCodeContext({
  question,
  projectId,
  branch,
  maxChunks = 8,
  maxFiles = DEFAULT_MAX_FILES
}) {
  if (!question || !question.trim()) {
    throw new Error('Question is required for retrieval');
  }

  const source = await resolveCodeSource({ projectId, branch });
  const files = await collectFiles(source.rootPath, maxFiles);
  const queryTokens = tokenize(question);

  const candidateChunks = [];

  for (const absoluteFilePath of files) {
    try {
      const stat = await fs.stat(absoluteFilePath);
      if (stat.size > MAX_FILE_BYTES) {
        continue;
      }

      const rawBuffer = await fs.readFile(absoluteFilePath);
      if (isLikelyBinary(rawBuffer)) {
        continue;
      }

      const text = rawBuffer.toString('utf-8');
      if (!text.trim()) {
        continue;
      }

      const relativePath = path.relative(source.rootPath, absoluteFilePath);
      const lineChunks = chunkLines(text.split('\n'));

      for (const lineChunk of lineChunks) {
        const score = scoreChunk({
          query: question,
          queryTokens,
          filePath: relativePath,
          content: lineChunk.text
        });

        candidateChunks.push({
          score,
          filePath: relativePath,
          startLine: lineChunk.startLine,
          endLine: lineChunk.endLine,
          content: lineChunk.text
        });
      }
    } catch {
      // Ignore unreadable files and continue retrieval.
    }
  }

  const ranked = candidateChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(maxChunks * 3, maxChunks));

  const nonZero = ranked.filter((c) => c.score > 0);
  const selected = (nonZero.length > 0 ? nonZero : ranked).slice(0, maxChunks);

  const evidence = selected.map((chunk, index) => {
    const evidenceId = `E${index + 1}`;
    const viewerPath = source.commit
      ? `/viewer/${source.projectId}/${source.branch}/${source.commit}/${chunk.filePath}?lineStart=${chunk.startLine}&lineEnd=${chunk.endLine}`
      : null;

    return {
      evidenceId,
      score: Number(chunk.score.toFixed(3)),
      filePath: chunk.filePath,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      content: chunk.content,
      viewerPath
    };
  });

  return {
    source,
    stats: {
      filesScanned: files.length,
      chunksRanked: candidateChunks.length,
      chunksSelected: evidence.length
    },
    evidence
  };
}
