'use client';

import ShadcnChatbotPanel from '@/components/ShadcnChatbotPanel';

export default function RightChatDock() {
  return (
    <aside className="codexlm-right-chat hidden xl:block">
      <ShadcnChatbotPanel title="Codebase Chat" showProjectControls={true} className="h-full border-none rounded-none" />
    </aside>
  );
}
