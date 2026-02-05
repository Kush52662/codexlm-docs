'use client';

import { useMemo, useState } from 'react';
import Script from 'next/script';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

const CHATKIT_CDN_SRC = 'https://cdn.jsdelivr.net/npm/@openai/chatkit/+esm';

async function fetchClientSecret(pathname) {
  const response = await fetch(pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error || 'Unable to create ChatKit session');
  }

  if (!json?.client_secret) {
    throw new Error('Server did not return a ChatKit client secret');
  }

  return json.client_secret;
}

export default function ChatKitRightPanel() {
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState('');

  const chatKit = useChatKit({
    api: {
      async getClientSecret(existingSecret) {
        try {
          setError('');
          if (existingSecret) {
            return await fetchClientSecret('/api/chatkit/refresh');
          }
          return await fetchClientSecret('/api/chatkit/start');
        } catch (e) {
          const message = e?.message || 'Failed to initialize chat.';
          setError(message);
          throw e;
        }
      }
    },
    theme: {
      colorScheme: 'light',
      radius: 'round'
    },
    header: {
      title: { text: 'CodexLM Chat' }
    },
    composer: {
      placeholder: 'Ask about this connected repository...'
    },
    startScreen: {
      greeting: 'Hi there! Ask me questions about your connected codebase.'
    },
    disclaimer: {
      text: 'CodexLM may make mistakes. Verify important details with source code.'
    }
  });

  const panelClassName = useMemo(
    () =>
      'nx-h-[72vh] nx-w-full nx-overflow-hidden nx-rounded-2xl nx-border nx-border-slate-200 dark:nx-border-slate-800 nx-bg-white dark:nx-bg-slate-950 nx-shadow-sm',
    []
  );

  return (
    <>
      <Script src={CHATKIT_CDN_SRC} type="module" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />

      <div className="nx-space-y-3">
        <h2 className="nx-text-lg nx-font-semibold nx-text-slate-900 dark:nx-text-white">Chat Panel</h2>
        <p className="nx-text-sm nx-text-slate-600 dark:nx-text-slate-400">
          Powered by OpenAI ChatKit React. This panel is ready for fast text-based testing.
        </p>

        {error ? (
          <div className="nx-rounded-md nx-border nx-border-red-300 nx-bg-red-50 nx-p-3 nx-text-xs nx-text-red-800">{error}</div>
        ) : null}

        {!scriptReady ? (
          <div className={panelClassName + ' nx-flex nx-items-center nx-justify-center nx-text-sm nx-text-slate-500'}>
            Loading ChatKit UI...
          </div>
        ) : (
          <div className={panelClassName}>
            <ChatKit control={chatKit.control} className="nx-block nx-h-full nx-w-full" />
          </div>
        )}
      </div>
    </>
  );
}
