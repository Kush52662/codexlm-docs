import { retrieveCodeContext } from '@/lib/rag/retriever';
import { getOpenAIKeyOrThrow, getServerEnv } from '@/lib/server/env';

const DEFAULT_MODEL = getServerEnv('CODEXLM_RAG_MODEL', {
  defaultValue: 'gpt-4.1-mini',
  preferDotEnvLocalInDevelopment: true
});

function extractOutputText(responseJson) {
  if (typeof responseJson?.output_text === 'string' && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  const outputs = Array.isArray(responseJson?.output) ? responseJson.output : [];
  const parts = [];

  for (const item of outputs) {
    if (item?.type !== 'message') {
      continue;
    }

    const contentItems = Array.isArray(item.content) ? item.content : [];
    for (const contentItem of contentItems) {
      if (contentItem?.type === 'output_text' && contentItem?.text) {
        parts.push(contentItem.text);
      }
    }
  }

  return parts.join('\n').trim();
}

function buildContextBlock(evidence) {
  return evidence
    .map((entry) => {
      return [
        `### ${entry.evidenceId}`,
        `file: ${entry.filePath}`,
        `lines: ${entry.startLine}-${entry.endLine}`,
        '```',
        entry.content,
        '```'
      ].join('\n');
    })
    .join('\n\n');
}

function buildSystemPrompt() {
  return [
    'You are CodexLM RAG Agent, a single-agent assistant for codebase Q&A.',
    'Use only the provided evidence context blocks.',
    'If the context is insufficient, explicitly say you are not sure and what is missing.',
    'Do not claim to have executed code or accessed files outside the provided context.',
    'For factual statements, add inline evidence citations like [E1] or [E2].',
    'Keep answers concise and implementation-focused.'
  ].join(' ');
}

function buildUserPrompt({ question, source, evidence }) {
  return [
    `Question: ${question}`,
    '',
    'Context scope:',
    `project: ${source.projectId}`,
    `branch: ${source.branch}`,
    `source_type: ${source.sourceType}`,
    `commit: ${source.commit || 'unknown'}`,
    '',
    'Evidence blocks:',
    buildContextBlock(evidence),
    '',
    'Respond with:',
    '1) A direct answer.',
    '2) A short confidence note if evidence is weak.',
    '3) Keep all citations inline using [E#].'
  ].join('\n');
}

async function generateAnswer({ model, systemPrompt, userPrompt }) {
  const apiKey = getOpenAIKeyOrThrow();

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.2
    })
  });

  const json = await response.json();
  if (!response.ok) {
    const errorMessage = json?.error?.message || 'Responses API request failed';
    throw new Error(errorMessage);
  }

  return {
    raw: json,
    text: extractOutputText(json)
  };
}

function filterCitationsFromAnswer(answerText, evidence) {
  const citedIds = new Set();
  const matches = answerText.match(/\[(E\d+)\]/g) || [];
  for (const raw of matches) {
    citedIds.add(raw.replace('[', '').replace(']', ''));
  }

  if (citedIds.size === 0) {
    return evidence;
  }

  return evidence.filter((entry) => citedIds.has(entry.evidenceId));
}

export class SingleAgentRagOrchestrator {
  constructor(config = {}) {
    this.model = config.model || DEFAULT_MODEL;
    this.maxChunks = config.maxChunks || 8;
  }

  async answerQuestion({ question, projectId, branch, maxChunks }) {
    const retrieval = await retrieveCodeContext({
      question,
      projectId,
      branch,
      maxChunks: maxChunks || this.maxChunks
    });

    if (!retrieval.evidence.length) {
      return {
        answer: 'I could not find relevant source context in the connected project.',
        citations: [],
        source: retrieval.source,
        stats: retrieval.stats
      };
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({
      question,
      source: retrieval.source,
      evidence: retrieval.evidence
    });

    const completion = await generateAnswer({
      model: this.model,
      systemPrompt,
      userPrompt
    });

    const answer = completion.text || 'I could not generate a response from the model.';
    const citations = filterCitationsFromAnswer(answer, retrieval.evidence);

    return {
      answer,
      citations,
      source: retrieval.source,
      stats: retrieval.stats
    };
  }
}

export const ragOrchestrator = new SingleAgentRagOrchestrator();
