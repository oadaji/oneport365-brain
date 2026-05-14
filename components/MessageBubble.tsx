"use client";

import { ChatMessage } from "@/types/chat";

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end px-4">
        <div
          className="px-4 py-2.5 max-w-[80%] text-sm leading-relaxed"
          style={{
            backgroundColor: "#3d7a2d",
            color: "#ffffff",
            borderRadius: "18px 4px 18px 18px",
          }}
        >
          {message.content}
        </div>
        <span className="text-[11px] mt-1 mr-1" style={{ color: "#7dba6a" }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 px-4">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5" style={{ backgroundColor: "#f0f7ef" }}>
        🧠
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div
          className="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d4e8d0",
            color: "#1a2d1c",
            borderRadius: "4px 18px 18px 18px",
          }}
        >
          {message.content}
        </div>
        <span className="text-[11px] mt-1 ml-1" style={{ color: "#7dba6a" }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
