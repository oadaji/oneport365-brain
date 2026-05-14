"use client";

import { useState } from "react";

const categories = [
  {
    label: "Finance",
    icon: "💰",
    suggestions: [
      "Show top 10 accounts payable",
      "What invoices are overdue?",
      "Show me this year's revenue trend",
      "What's our cash flow position?",
    ],
  },
  {
    label: "Commercial",
    icon: "📊",
    suggestions: [
      "Summarise today's RFQs",
      "Draft a rate response email",
      "Which customers have the most quotes?",
      "Show me pending quote follow-ups",
    ],
  },
  {
    label: "Operations",
    icon: "🚢",
    suggestions: [
      "What documents are needed for Nigeria import?",
      "Explain FCL vs LCL",
      "What's the status of active shipments?",
      "List available rates for China to Lagos",
    ],
  },
];

export default function SuggestionChips({ onSelect }: { onSelect: (text: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeCat = categories.find((c) => c.label === activeCategory);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <img src="/brain-icon.png" alt="Brain" style={{ width: "64px", height: "64px" }} className="mb-4" />
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1a2d1c" }}>OnePort 365 Brain</h2>
      <p className="text-sm mb-6" style={{ color: "#2d5225" }}>
        Your AI assistant for Commercial, Finance and Operations
      </p>

      {!activeCategory ? (
        <div className="flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.03] cursor-pointer"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d4e8d0",
                color: "#2d5225",
                minWidth: "130px",
              }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 max-w-lg">
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs font-medium cursor-pointer mb-1 flex items-center gap-1"
            style={{ color: "#3d7a2d" }}
          >
            ← Back to categories
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{activeCat?.icon}</span>
            <span className="text-sm font-semibold" style={{ color: "#1a2d1c" }}>{activeCategory}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {activeCat?.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSelect(s)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d4e8d0",
                  color: "#2d5225",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
