"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MessageSquareHeart, Send, Sparkles, X } from "lucide-react";
import type { SubscriptionContext } from "@/lib/auth";
import { StatusPill } from "@/components/admin/workspace-ui";

type ChiChiMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: Array<{ type: string; label: string; route?: string }>;
};

export function ChiChiAssistant({ subscription }: { subscription: SubscriptionContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChiChiMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text:
        subscription.planKey === "elite"
          ? "ChiChi can answer buyer balance questions, summarize breeder activity, open the AI document generator, and surface overdue payments from your live workspace."
          : "ChiChi is available with Premium for breeder-specific AI workflows, account summaries, and AI-assisted document and website actions.",
    },
  ]);

  const send = () => {
    if (!input.trim()) {
      return;
    }

    const message = input.trim();
    setInput("");
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text: message }]);

    startTransition(async () => {
      try {
        const response = await fetch("/api/chichi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          answer?: string;
          actions?: Array<{ type: string; label: string; route?: string }>;
        };

        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: payload.error ?? payload.answer ?? "ChiChi could not complete that request.",
            actions: payload.actions ?? [],
          },
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            text: "ChiChi could not complete that request right now.",
          },
        ]);
      }
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 hidden lg:block">
      {isOpen ? (
        <div className="w-[380px] rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,19,25,0.98),rgba(9,13,18,0.96)_42%,rgba(8,11,16,0.98))] shadow-[0_26px_60px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">ChiChi</p>
              <p className="mt-1 text-sm text-stone-300">Breeder system assistant</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-white/[0.08] bg-white/[0.04] p-2 text-stone-300">
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[460px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "ml-8 rounded-2xl border border-gold/20 bg-gold/10 p-3" : "mr-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3"}>
                <p className="text-sm leading-6 text-stone-200">{message.text}</p>
                {message.actions && message.actions.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action) =>
                      action.route ? (
                        <Link
                          key={`${message.id}-${action.label}`}
                          href={action.route}
                          className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-soft"
                        >
                          {action.label}
                        </Link>
                      ) : null,
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.07] px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {["Who has overdue payments?", "How much does this buyer owe?", "Create a deposit agreement"].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-stone-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask ChiChi about buyers, payments, or next actions"
                className="form-input h-11 flex-1"
              />
              <button
                type="button"
                onClick={send}
                disabled={isPending}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/35 bg-gold text-[#20160c] shadow-gold disabled:opacity-60"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-full border border-gold/25 bg-[linear-gradient(135deg,rgba(215,173,103,0.18),rgba(215,173,103,0.08)_35%,rgba(14,20,26,0.98))] px-4 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.28)]"
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
            <MessageSquareHeart className="size-4" />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-50">ChiChi</p>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill tone="green">Live</StatusPill>
              <span className="text-xs text-stone-400">Assistant</span>
            </div>
          </div>
          <Sparkles className="size-4 text-gold" />
        </button>
      )}
    </div>
  );
}
