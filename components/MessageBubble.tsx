"use client";

import ReactMarkdown from "react-markdown";
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
        <img src="/brain-icon.png" alt="" className="w-4 h-4" />
      </div>
      <div className="flex flex-col max-w-[80%]">
        <div
          className="px-4 py-2.5 text-sm leading-relaxed prose prose-sm max-w-none"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #d4e8d0",
            color: "#1a2d1c",
            borderRadius: "4px 18px 18px 18px",
          }}
        >
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div style={{ overflowX: "auto", margin: "8px 0" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid #d4e8d0", color: "#2d5225", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td style={{ padding: "5px 10px", borderBottom: "1px solid #f0f7ef", fontSize: "12px" }}>
                  {children}
                </td>
              ),
              h1: ({ children }) => <h1 style={{ fontSize: "16px", fontWeight: 700, margin: "8px 0 4px", color: "#1a2d1c" }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontSize: "14px", fontWeight: 600, margin: "8px 0 4px", color: "#2d5225" }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: "13px", fontWeight: 600, margin: "6px 0 4px", color: "#2d5225" }}>{children}</h3>,
              strong: ({ children }) => <strong style={{ fontWeight: 600, color: "#1a2d1c" }}>{children}</strong>,
              ul: ({ children }) => <ul style={{ paddingLeft: "18px", margin: "4px 0" }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: "18px", margin: "4px 0" }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: "2px" }}>{children}</li>,
              hr: () => <hr style={{ border: "none", borderTop: "1px solid #d4e8d0", margin: "8px 0" }} />,
              code: ({ children }) => (
                <code style={{ backgroundColor: "#f0f7ef", padding: "1px 4px", borderRadius: "3px", fontSize: "11px", fontFamily: "monospace" }}>
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span className="text-[11px] mt-1 ml-1" style={{ color: "#7dba6a" }}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
