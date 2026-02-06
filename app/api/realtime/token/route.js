import { NextResponse } from 'next/server';
import { getOpenAIKeyOrThrow, getServerEnv } from '@/lib/server/env';

export async function POST() {
  try {
    const apiKey = getOpenAIKeyOrThrow();
    const model = getServerEnv('OPENAI_REALTIME_MODEL', {
      defaultValue: 'gpt-4o-realtime-preview-2024-12-17',
      preferDotEnvLocalInDevelopment: true
    });

    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model,
          instructions:
            'You are CodexLM realtime assistant. Keep answers concise and technical. If you are unsure, say so explicitly.'
        }
      })
    });

    const json = await response.json();
    if (!response.ok) {
      const message = json?.error?.message || 'Failed to create realtime client secret';
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const value = json?.value || json?.client_secret?.value;
    if (!value) {
      return NextResponse.json({ error: 'Realtime client secret missing in response' }, { status: 500 });
    }

    return NextResponse.json({ client_secret: value, model });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unexpected realtime token error' }, { status: 500 });
  }
}
