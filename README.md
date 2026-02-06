# CodexLM

**CodexLM is the GPS for your codebase and a NotebookLM-style realtime chat workspace for software projects.** It helps developers understand code quickly while Codex is building features in parallel.

## The Core Problem

In fast workflows, repository context becomes stale across chats, branches, and worktrees. Developers lose time validating what changed and where to look. CodexLM solves this with a living, branch-aware docs layer plus source-grounded realtime conversation.

## The Solution

Like NotebookLM, CodexLM is designed for understanding through grounded dialogue. But instead of general documents, it is **specialized for codebases**. 

You can ask questions in realtime, and CodexLM answers with evidence from current project sources, then navigates to the exact docs or file context being discussed. Every answer is tied to freshness metadata (branch, commit, indexed time) so users know whether context is current.

## MVP Features

Our MVP includes:

- **CodeWiki-style Docs Viewer**: Left navigation, center content, right chat.
- **Realtime NotebookLM-like Chat**: For repository understanding.
- **Source Citations**: With stale-context warnings.
- **Read-only Code Verification**: Routes for file/line checks.
- **Fast Visual Understanding**: Artifacts like mindmaps and infographics.

## Philosophy

**CodexLM is intentionally not a coding agent.** 

Codex writes code; CodexLM ensures humans stay oriented and confident in what that code means. This creates a strong Codex companion workflow: while generation runs, teams use CodexLM to understand architecture, validate assumptions, and prepare review/test focus. The outcome is faster onboarding, safer decisions, and higher-quality implementation cycles.

---

# Technical Documentation

This is the documentation for CodexLM, built with [Nextra](https://nextra.site).

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

## Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the docs.

## Building

To build the static site:

```bash
npm run build
```

## Dynamic Code Viewer

The app includes a dynamic code viewer route at `/viewer/[...path]`.

### Snapshot Directory Structure

The viewer reads files from a `snapshots` directory in the root of the project. The structure must be:

```
snapshots/
  <project>/
    <branch>/
      <commit>/
        <path/to/file>
```

Example: `snapshots/codexlm/main/latest/src/utils.js`

### Usage

URL Format:
`/viewer/<project>/<branch>/<commit>/<path/to/file>`

Query Parameters:
- `lineStart`: Start line for highlighting (1-based)
- `lineEnd`: End line for highlighting (1-based)

### API Endpoint

An API endpoint is available at `/api/code` to fetch raw file content.

Query Parameters:
- `project`
- `branch`
- `commit`
- `path`

Example: `/api/code?project=codexlm&branch=main&commit=latest&path=src/utils.js`

Required environment variables:
- `OPENAI_API_KEY`
- `OPENAI_CHATKIT_WORKFLOW_ID`

Session endpoints:
- `POST /api/chatkit/start`
- `POST /api/chatkit/refresh`

## Realtime API (Current Chat Path)

The right docked chat panel is now connected to OpenAI Realtime API via WebRTC.

- Token endpoint: `POST /api/realtime/token`
- Browser session transport: `wss/webrtc` via OpenAI Realtime Calls
- Model env: `OPENAI_REALTIME_MODEL` (default `gpt-realtime`)

## Environment Variable Precedence (Hardened)

To avoid stale shell exports overriding app credentials, server-side OpenAI routes now use this precedence:

Development (`NODE_ENV !== production`):
1. `.env.local` value (preferred)
2. process environment (`process.env`)
3. default value (where applicable)

Production:
1. process environment (`process.env`)
2. default value (where applicable)

This precedence is enforced for:
- Realtime token path (`/api/realtime/token`)
- RAG answer path (`/api/rag/ask`)
