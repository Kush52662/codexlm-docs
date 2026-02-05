import fs from 'fs';
import path from 'path';

let cachedLocalEnv = null;

function parseDotEnv(content) {
  const result = {};
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalIdx = line.indexOf('=');
    if (equalIdx <= 0) {
      continue;
    }

    const key = line.slice(0, equalIdx).trim();
    let value = line.slice(equalIdx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function loadDotEnvLocal() {
  if (cachedLocalEnv !== null) {
    return cachedLocalEnv;
  }

  try {
    const envLocalPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envLocalPath, 'utf-8');
    cachedLocalEnv = parseDotEnv(content);
    return cachedLocalEnv;
  } catch {
    cachedLocalEnv = {};
    return cachedLocalEnv;
  }
}

export function getServerEnv(
  key,
  {
    defaultValue,
    preferDotEnvLocalInDevelopment = false
  } = {}
) {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (preferDotEnvLocalInDevelopment && isDevelopment) {
    const localValue = loadDotEnvLocal()[key];
    if (localValue !== undefined && localValue !== '') {
      return localValue;
    }
  }

  const processValue = process.env[key];
  if (processValue !== undefined && processValue !== '') {
    return processValue;
  }

  if (isDevelopment) {
    const localFallback = loadDotEnvLocal()[key];
    if (localFallback !== undefined && localFallback !== '') {
      return localFallback;
    }
  }

  return defaultValue;
}

export function getOpenAIKeyOrThrow() {
  const key = getServerEnv('OPENAI_API_KEY', {
    preferDotEnvLocalInDevelopment: true
  });

  if (!key) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return key;
}
