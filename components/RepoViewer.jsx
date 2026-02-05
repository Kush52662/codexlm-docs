'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Callout } from 'nextra/components';
import { useRouter } from 'next/navigation';
import { FileCode, FileText, Folder } from 'lucide-react';
import RichCodeViewer from './RichCodeViewer';
import DocViewer from './DocViewer';

function TreeNode({ item, activePath, onOpen }) {
  if (item.type === 'directory') {
    return (
      <details open={activePath.startsWith(item.path)} className="nx-ml-2">
        <summary className="nx-flex nx-items-center nx-gap-1 nx-cursor-pointer nx-text-xs nx-text-slate-600 dark:nx-text-slate-300 nx-py-0.5">
          <Folder size={12} />
          {item.name}
        </summary>
        <div className="nx-ml-3 nx-border-l nx-border-slate-200 dark:nx-border-slate-700 nx-pl-2">
          {(item.children || []).map((child) => (
            <TreeNode key={child.path} item={child} activePath={activePath} onOpen={onOpen} />
          ))}
        </div>
      </details>
    );
  }

  return (
    <button
      type="button"
      className={`nx-block nx-text-left nx-w-full nx-text-xs nx-px-2 nx-py-1 nx-rounded ${
        activePath === item.path
          ? 'nx-bg-blue-100 dark:nx-bg-blue-900/40 nx-text-blue-700 dark:nx-text-blue-300'
          : 'nx-text-slate-600 hover:nx-bg-slate-100 dark:nx-text-slate-300 dark:hover:nx-bg-slate-800'
      }`}
      onClick={() => onOpen(item.path)}
    >
      {item.name}
    </button>
  );
}

export default function RepoViewer({ params, fileData, tree }) {
  const router = useRouter();

  const project = params.path[0];
  const branch = params.path[1];
  const commit = params.path[2];
  const filePath = params.path.slice(3);
  const currentPathString = filePath.join('/');
  const fileName = filePath[filePath.length - 1] || '';
  const extension = (fileName.split('.').pop() || '').toLowerCase();

  const isDocFile = ['md', 'mdx'].includes(extension);
  const [viewMode, setViewMode] = useState(isDocFile ? 'docs' : 'code');

  useEffect(() => {
    setViewMode(isDocFile ? 'docs' : 'code');
  }, [currentPathString, isDocFile]);

  const sortedTree = useMemo(() => {
    return Array.isArray(tree) ? tree : [];
  }, [tree]);

  const openPath = (nextFilePath) => {
    router.push(`/viewer/${project}/${branch}/${commit}/${nextFilePath}`);
  };

  return (
    <div className="nx-flex nx-flex-col lg:nx-flex-row nx-min-h-[calc(100vh-64px)]">
      <aside className="nx-hidden lg:nx-block nx-w-72 nx-border-r nx-border-slate-200 dark:nx-border-slate-800 nx-p-4">
        <p className="nx-mb-3 nx-text-[11px] nx-font-semibold nx-uppercase nx-tracking-wide nx-text-slate-500">
          Explorer
        </p>
        <div className="nx-max-h-[calc(100vh-140px)] nx-overflow-auto nx-space-y-1">
          {sortedTree.map((item) => (
            <TreeNode
              key={item.path}
              item={item}
              activePath={currentPathString}
              onOpen={openPath}
            />
          ))}
        </div>
      </aside>

      <main className="nx-flex-1 nx-p-6 md:nx-p-10 nx-max-w-6xl nx-mx-auto nx-w-full">
        <div className="nx-flex nx-items-center nx-justify-between nx-mb-6">
          <h1 className="nx-text-2xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-white">
            {fileName}
          </h1>

          <div className="nx-flex nx-bg-slate-100 dark:nx-bg-slate-800 nx-p-1 nx-rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('docs')}
              className={`nx-flex nx-items-center nx-gap-2 nx-px-3 nx-py-1.5 nx-rounded-md nx-text-xs nx-font-medium ${
                viewMode === 'docs'
                  ? 'nx-bg-white dark:nx-bg-slate-700 nx-text-blue-600 dark:nx-text-blue-300'
                  : 'nx-text-slate-500'
              }`}
            >
              <FileText size={14} /> Docs
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`nx-flex nx-items-center nx-gap-2 nx-px-3 nx-py-1.5 nx-rounded-md nx-text-xs nx-font-medium ${
                viewMode === 'code'
                  ? 'nx-bg-white dark:nx-bg-slate-700 nx-text-blue-600 dark:nx-text-blue-300'
                  : 'nx-text-slate-500'
              }`}
            >
              <FileCode size={14} /> Code
            </button>
          </div>
        </div>

        <div className="nx-mb-6 nx-text-xs nx-font-mono nx-text-slate-500">
          {project}/{branch}/{commit}/{currentPathString}
        </div>

        {viewMode === 'docs' ? (
          isDocFile ? (
            <DocViewer content={fileData.content} />
          ) : (
            <Callout type="info" emoji="💡">
              This file is source code. Switch to <b>Code</b> view for syntax highlighting.
            </Callout>
          )
        ) : (
          <RichCodeViewer content={fileData.content} extension={extension} />
        )}

        <footer className="nx-mt-10 nx-pt-6 nx-border-t nx-border-slate-200 dark:nx-border-slate-800 nx-text-[11px] nx-text-slate-500 nx-flex nx-justify-between">
          <span>Indexed at {new Date(fileData.metadata.indexed_at).toLocaleString()}</span>
          <span>{fileData.metadata.size} bytes</span>
        </footer>
      </main>
    </div>
  );
}
