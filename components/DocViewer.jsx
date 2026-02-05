'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';

export default function DocViewer({ content }) {
  return (
    <div className="nx-prose dark:nx-prose-invert nx-max-w-none nx-p-8 nx-bg-white dark:nx-bg-neutral-900 nx-rounded-xl nx-border nx-border-slate-200 dark:nx-border-neutral-800 nx-shadow-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
