import { NextResponse } from 'next/server';

const CHATKIT_SESSIONS_URL = 'https://api.openai.com/v1/chatkit/sessions';

async function createChatkitSession() {
  const apiKey = process.env.OPENAI_API_KEY;
  const workflowId = process.env.OPENAI_CHATKIT_WORKFLOW_ID;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  if (!workflowId) {
    throw new Error('OPENAI_CHATKIT_WORKFLOW_ID is not set');
  }

  const response = await fetch(CHATKIT_SESSIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'chatkit_beta=v1'
    },
    body: JSON.stringify({
      workflow: {
        id: workflowId
      },
      user: {
        id: `codexlm-${crypto.randomUUID()}`
      }
    })
  });

  const json = await response.json();
  if (!response.ok) {
    const message = json?.error?.message || 'Failed to create ChatKit session';
    throw new Error(message);
  }

  const clientSecret = json?.client_secret?.value || json?.client_secret;
  if (!clientSecret) {
    throw new Error('ChatKit session response did not include a client secret');
  }

  return clientSecret;
}

export async function POST() {
  try {
    const clientSecret = await createChatkitSession();
    return NextResponse.json({ client_secret: clientSecret });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to start ChatKit session' },
      { status: 500 }
    );
  }
}
