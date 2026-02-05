# Single-Agent RAG Orchestrator Spec

Date: February 5, 2026

## 1. Goal

Build a single-agent orchestrator inside the existing `codexlm-docs` Next/Nextra app that can answer user questions using connected codebase context.

## 2. Constraints

- Single app only (no sidecar app)
- Single agent only
- No custom model tool-calling/function tools for MVP
- Answers must be grounded in retrieved local code/doc chunks
- Output must include citations that can map to `/viewer/...` routes

## 3. Research Inputs (Primary Sources)

- OpenAI Realtime Agents demo structure (single app, agent config patterns):
  - https://github.com/openai/openai-realtime-agents
- OpenAI Responses API shape for text generation and iterative orchestration:
  - https://platform.openai.com/docs/api-reference/responses
- OpenAI Realtime guide for future talk mode expansion:
  - https://platform.openai.com/docs/guides/realtime

## 4. System Design

### Retrieval layer

- Source of truth priority:
  1. `snapshots/<project>/<branch>/latest`
  2. `snapshots/<project>/<branch>/<commitSha>` (from metadata)
  3. connector `repoPath`
- Parse text/code files only, skip binaries/large files
- Chunk by line ranges with overlap to preserve local context
- Score chunks using query-term overlap + path/filename boosts
- Return top-K chunks as evidence

### Orchestrator layer

- One orchestrator entrypoint: `answerQuestion(...)`
- Build strict system prompt:
  - use only provided context
  - admit uncertainty when context is insufficient
  - cite evidence IDs inline
- Call OpenAI Responses API once (no tool loop)
- Return:
  - answer text
  - citation metadata
  - source snapshot metadata

### API layer

- `GET /api/rag/projects`: list connector projects and branches
- `POST /api/rag/ask`: execute orchestrator and return grounded answer

### UI layer

- `app/notebook/page.jsx` in the same app
- Text input -> `POST /api/rag/ask` -> render markdown answer + citations

## 5. Non-goals (MVP)

- Multi-agent handoffs
- Navigation tool calls (`open_page`, `open_code_file`) as model tools
- Full semantic/vector index infrastructure
- Cross-repo distributed retrieval

## 6. Acceptance Criteria

- User can ask a question and receive a grounded answer
- Answer includes source citations with file + line ranges
- If evidence is weak, assistant states uncertainty
- Works against connected app configured in `connectors.json`

## 7. Risks and Mitigations

- Retrieval misses relevant chunk
  - mitigate with larger top-K + overlap + path boosting
- Snapshot stale vs repo head
  - expose source mode (`latest`, commit, or repoPath) in response metadata
- Token overflow on large context
  - cap chunks and per-chunk content length

## 8. Next Step After MVP

- Add realtime voice IO using the same orchestrator backend
- Add deterministic navigation actions after talk-only quality is validated
