import { useChat } from "@ai-sdk/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { Compass, ExternalLink, MessageCircle, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePlan } from "@/lib/trip-store";

const quickQuestions = [
  "Plan a Jaipur trip under ₹10,000",
  "What should I pack for my trip?",
  "Help me find verified local services",
];

const quickLinks = [
  { to: "/plan", label: "Plan a trip" },
  { to: "/explore", label: "Explore" },
  { to: "/services", label: "Local services" },
] as const;

export function GlobalAssistant() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const plan = usePlan();
  const planContext = plan
    ? {
        destination: plan.input.destination,
        travellers: plan.input.travellers,
        budget: plan.input.budget,
        startDate: plan.input.startDate,
        endDate: plan.input.endDate,
        interests: plan.input.interests,
      }
    : null;
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, context: { pathname, plan: planContext } },
        }),
      }),
    [pathname, planContext],
  );
  const { messages, sendMessage, status, stop, error, regenerate, setMessages } = useChat({
    id: "yatri-global-assistant",
    transport,
  });
  const busy = status === "submitted" || status === "streaming";

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed right-4 bottom-20 z-40 h-12 gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lift hover:bg-primary/90 md:right-6 md:bottom-6"
          aria-label="Ask YATRI travel assistant"
        >
          <MessageCircle className="size-5" />
          <span className="hidden sm:inline">Ask YATRI</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-[calc(100dvh-4rem)] w-[calc(100%-0.5rem)] flex-col gap-0 overflow-hidden p-0 [&>button]:text-primary-foreground sm:h-full sm:max-w-[28rem]"
      >
        <SheetHeader className="border-b bg-primary px-5 py-4 pr-14 text-left text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Compass className="size-5" />
            </span>
            <div>
              <SheetTitle className="text-base text-primary-foreground">Ask YATRI</SheetTitle>
              <SheetDescription className="text-primary-foreground/70">
                Fast, practical help for your journey
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Conversation className="min-h-0 bg-card">
          <ConversationContent className="gap-5 px-5 py-6">
            {messages.length === 0 ? (
              <ConversationEmptyState className="justify-start px-0 py-4 text-left">
                <div className="w-full">
                  <p className="kicker">Your travel desk</p>
                  <h2 className="mt-2 text-2xl">Where can I help?</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Ask about budgets, routes, local food, stays, safety, packing, or anything on this page.
                  </p>
                  {planContext && (
                    <div className="mt-4 border-l-2 border-accent bg-surface px-3 py-2 text-sm">
                      I can see your saved {planContext.destination} trip and use it as context.
                    </div>
                  )}
                  <div className="mt-5 grid gap-2">
                    {quickQuestions.map((question) => (
                      <Button
                        key={question}
                        type="button"
                        variant="outline"
                        className="h-auto justify-start whitespace-normal px-3 py-2.5 text-left text-xs"
                        onClick={() => send(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        {item.label} <ExternalLink className="size-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : undefined}>
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <MessageResponse key={`${message.id}-text-${index}`}>{part.text}</MessageResponse>;
                      }
                      if (part.type === "reasoning") {
                        return (
                          <Reasoning
                            key={`${message.id}-reasoning-${index}`}
                            isStreaming={status === "streaming" && message.id === messages.at(-1)?.id}
                            defaultOpen={false}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
            {status === "submitted" && <Shimmer className="text-sm">YATRI is checking your trip...</Shimmer>}
            {error && (
              <div role="alert" className="border-l-2 border-destructive bg-destructive/5 px-3 py-3 text-sm">
                <p>{error.message || "YATRI could not answer right now."}</p>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void regenerate()}>
                  <RotateCcw className="size-3.5" /> Retry
                </Button>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-surface p-3">
          <PromptInput onSubmit={({ text }) => send(text)} className="bg-card">
            <PromptInputTextarea
              aria-label="Message YATRI"
              placeholder="Ask about your trip..."
              disabled={busy}
              className="min-h-[72px] max-h-32"
            />
            <PromptInputFooter className="justify-between">
              <span className="text-[11px] text-muted-foreground">Enter to send</span>
              <div className="flex items-center gap-1">
                {messages.length > 0 && !busy && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Start a new chat"
                    onClick={() => setMessages([])}
                  >
                    <X className="size-4" />
                  </Button>
                )}
                <PromptInputSubmit status={status} onStop={stop} disabled={!busy && status !== "ready"} />
              </div>
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 px-1 text-center text-[10px] text-muted-foreground">
            Check important prices, timings, and safety information locally.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
