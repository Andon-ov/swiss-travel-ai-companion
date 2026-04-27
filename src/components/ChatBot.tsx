"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import type { Message, Language } from "@/types";
import { UI_STRINGS } from "@/lib/constants";

interface ChatBotProps {
  language?: Language;
  className?: string;
}

let messageIdCounter = 0;
function generateId(): string {
  return `msg-${++messageIdCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ChatBot({ language = "en", className }: ChatBotProps) {
  const t = UI_STRINGS[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        language === "zh"
          ? "您好！我是您的瑞士旅游助手。请问有什么我可以帮助您的？"
          : language === "ja"
            ? "こんにちは！スイス旅行アシスタントです。何かお手伝いできますか？"
            : language === "ko"
              ? "안녕하세요! 스위스 여행 도우미입니다. 무엇을 도와드릴까요?"
              : "Hello! I'm your Swiss travel assistant. How can I help you plan your perfect Swiss adventure? 🇨🇭",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: t.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-alpine-blue to-alpine-blue-light px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">
          🇨🇭
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{t.chatTitle}</h3>
          <p className="text-white/70 text-xs">AI Travel Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-white/70 text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={clsx("flex", {
              "justify-end": message.role === "user",
              "justify-start": message.role === "assistant",
            })}
          >
            <div
              className={clsx("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", {
                "bg-alpine-blue text-white rounded-br-sm":
                  message.role === "user",
                "bg-alpine-snow text-gray-800 rounded-bl-sm":
                  message.role === "assistant",
              })}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-alpine-snow rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chatPlaceholder}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alpine-blue/50 focus:border-alpine-blue transition-colors"
          aria-label="Chat message input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-alpine-blue hover:bg-alpine-blue-light disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-colors shrink-0"
          aria-label="Send message"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}
