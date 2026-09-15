import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ChatMessage = { role: "user" | "ai"; text: string };

const suggestions = [
  "Keep the total budget under ₹8,000",
  "Add more cultural activities",
  "Reduce hotel cost",
  "Spend less on food",
  "Add one more day",
  "Add a mechanic near my route",
];

export function AIChat({
  messages,
  onSend,
  busy,
  title = "YATRI AI",
  subtitle = "Your travel concierge. Ask for changes in plain language.",
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  busy?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length, busy]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <div className="surface-card flex h-full flex-col overflow-hidden">
      <header className="bg-surface flex items-center gap-3 border-b px-5 py-4">
        <span className="gradient-hero text-primary-foreground flex size-9 items-center justify-center rounded-md">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </header>

      <div className="max-h-[420px] min-h-[220px] flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-md px-4 py-2.5 text-sm",
              m.role === "user"
                ? "bg-primary text-primary-foreground ml-auto rounded-br-md"
                : "bg-secondary rounded-bl-md",
            )}
          >
            {m.text}
          </div>
        ))}
        {busy && (
          <div className="bg-secondary text-muted-foreground w-fit rounded-md rounded-bl-md px-4 py-2.5 text-sm">
            YATRI AI is re-planning…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="space-y-3 border-t p-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="bg-secondary hover:bg-surface-2 rounded-sm px-3 py-1.5 text-[11px] font-medium"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask YATRI AI to change your plan…"
            className="rounded-md"
          />
          <Button type="submit" size="icon" className="rounded-md" disabled={busy}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
