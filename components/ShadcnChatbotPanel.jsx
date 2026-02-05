'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const INITIAL_ASSISTANT_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hi there. Realtime is enabled. Ask anything and I will respond immediately.'
};

function buildAssistantMessageId() {
  return `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ShadcnChatbotPanel({
  className,
  title = 'Codebase Chat',
  showProjectControls = true
}) {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [branch, setBranch] = useState('main');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionState, setConnectionState] = useState('connecting');

  const scrollerRef = useRef(null);
  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const activeAssistantMessageIdRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const response = await fetch('/api/rag/projects');
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json?.error || 'Unable to load connected projects.');
        }

        if (!active) return;

        const list = Array.isArray(json.projects) ? json.projects : [];
        setProjects(list);

        if (list.length > 0) {
          setProjectId((current) => current || list[0].projectId);
          setBranch((current) => current || list[0].defaultBranch || 'main');
        }
      } catch (e) {
        if (!active) return;
        setError(e?.message || 'Unable to load projects.');
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    let cancelled = false;

    async function initRealtime() {
      setConnectionState('connecting');
      setError('');

      try {
        const tokenResponse = await fetch('/api/realtime/token', { method: 'POST' });
        const tokenJson = await tokenResponse.json();
        if (!tokenResponse.ok) {
          throw new Error(tokenJson?.error || 'Failed to initialize realtime session');
        }

        const ephemeralKey = tokenJson.client_secret;
        const model = tokenJson.model || 'gpt-realtime';

        const pc = new RTCPeerConnection();
        peerRef.current = pc;

        // Realtime WebRTC calls require an audio m-line in the SDP offer.
        // We keep text-only UX by requesting recvonly audio and using
        // data-channel events for message exchange.
        pc.addTransceiver('audio', { direction: 'recvonly' });

        const dc = pc.createDataChannel('oai-events');
        dataChannelRef.current = dc;

        dc.onopen = () => {
          if (cancelled) return;
          setConnectionState('connected');
          setError('');
        };

        dc.onclose = () => {
          if (cancelled) return;
          setConnectionState('disconnected');
        };

        dc.onerror = () => {
          if (cancelled) return;
          setConnectionState('error');
          setError('Realtime data channel error.');
        };

        dc.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);

            if (payload.type === 'error') {
              setIsLoading(false);
              setError(payload.error?.message || 'Realtime error');
              return;
            }

            if (payload.type === 'response.text.delta') {
              const delta = payload.delta || '';
              const activeId = activeAssistantMessageIdRef.current;
              if (!activeId) return;

              setMessages((current) =>
                current.map((message) =>
                  message.id === activeId
                    ? { ...message, content: `${message.content || ''}${delta}` }
                    : message
                )
              );
              return;
            }

            if (payload.type === 'response.done') {
              setIsLoading(false);
              activeAssistantMessageIdRef.current = null;
            }
          } catch {
            // ignore malformed non-JSON events
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpResponse = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp'
          },
          body: offer.sdp
        });

        if (!sdpResponse.ok) {
          const body = await sdpResponse.text();
          throw new Error(body || 'Realtime SDP exchange failed');
        }

        const answer = await sdpResponse.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answer });
      } catch (e) {
        if (cancelled) return;
        setConnectionState('error');
        setError(e?.message || 'Failed to connect to Realtime API');
      }
    }

    initRealtime();

    return () => {
      cancelled = true;
      try {
        dataChannelRef.current?.close();
      } catch {}
      try {
        peerRef.current?.close();
      } catch {}
      dataChannelRef.current = null;
      peerRef.current = null;
    };
  }, []);

  const selectedProject = useMemo(
    () => projects.find((project) => project.projectId === projectId),
    [projects, projectId]
  );

  function sendRealtimeEvent(payload) {
    const dc = dataChannelRef.current;
    if (!dc || dc.readyState !== 'open') {
      throw new Error('Realtime connection is not open');
    }
    dc.send(JSON.stringify(payload));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || isLoading) {
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question
      };
      setMessages((current) => [...current, userMessage]);
      setPrompt('');

      const assistantMessageId = buildAssistantMessageId();
      activeAssistantMessageIdRef.current = assistantMessageId;

      setMessages((current) => [
        ...current,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: ''
        }
      ]);

      const scopedQuestion = `[project=${projectId || 'unknown'} branch=${branch || 'main'}]\n${question}`;

      sendRealtimeEvent({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_text', text: scopedQuestion }]
        }
      });

      sendRealtimeEvent({ type: 'response.create' });
    } catch (e) {
      setIsLoading(false);
      activeAssistantMessageIdRef.current = null;
      setError(e?.message || 'Failed to send realtime message');
    }
  }

  return (
    <Card className={cn('h-full overflow-hidden flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className="text-xs text-muted-foreground">{connectionState}</span>
        </div>
        <CardDescription>
          Realtime API enabled. Low-latency text responses over WebRTC data channel.
        </CardDescription>

        {showProjectControls ? (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <select
              value={projectId}
              onChange={(event) => {
                const value = event.target.value;
                setProjectId(value);
                const project = projects.find((item) => item.projectId === value);
                if (project?.defaultBranch) {
                  setBranch(project.defaultBranch);
                }
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              {projects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.projectId}
                </option>
              ))}
            </select>
            <Input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="branch" />
          </div>
        ) : null}
      </CardHeader>

      <Separator />

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <ScrollArea className="flex-1 px-4 py-4" viewportRef={scrollerRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content || (message.role === 'assistant' ? '...' : '')}</div>
              </div>
            ))}

            {isLoading ? (
              <div className="max-w-[92%] rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                Thinking...
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-2 p-4">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask about this repository"
            className="min-h-20 resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {selectedProject ? `${selectedProject.projectId}:${branch}` : 'No project connected'}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim() || connectionState !== 'connected'}
            >
              Send
              <SendHorizontal className="size-4" />
            </Button>
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
