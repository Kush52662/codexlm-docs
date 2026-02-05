'use client';

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const getLanguageExtension = (extension) => {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'js':
    case 'cjs':
    case 'mjs':
    case 'jsx':
      return javascript({ jsx: true });
    case 'ts':
    case 'tsx':
      return javascript({ jsx: true, typescript: true });
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    case 'md':
    case 'mdx':
      return markdown();
    default:
      return [];
  }
};

export default function RichCodeViewer({ content, extension }) {
  const language = getLanguageExtension(extension);

  return (
    <div className="nx-rounded-xl nx-overflow-hidden nx-border nx-border-slate-200 dark:nx-border-gray-800 nx-shadow-sm">
      <CodeMirror
        value={content}
        height="auto"
        minHeight="300px"
        theme={vscodeDark}
        extensions={[language]}
        editable={false}
        readOnly={true}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
        }}
        className="nx-text-sm"
      />
    </div>
  );
}
