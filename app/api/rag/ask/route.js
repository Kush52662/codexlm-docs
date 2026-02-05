import { NextResponse } from 'next/server';
import { ragOrchestrator } from '@/lib/rag/orchestrator';

export async function POST(request) {
  try {
    const body = await request.json();
    const question = body?.question?.trim();

    if (!question) {
      return NextResponse.json(
        { error: 'Missing required field: question' },
        { status: 400 }
      );
    }

    const result = await ragOrchestrator.answerQuestion({
      question,
      projectId: body?.projectId,
      branch: body?.branch,
      maxChunks: body?.maxChunks
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API/RAG/ASK] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to answer question' },
      { status: 500 }
    );
  }
}
