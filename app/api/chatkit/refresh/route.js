import { POST as startChatKitSession } from '@/app/api/chatkit/start/route';

export async function POST() {
  return startChatKitSession();
}
