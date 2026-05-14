"use client";

const suggestions = [
  "Show top 10 accounts payable",
  "What invoices are overdue?",
  "Show me this year's revenue trend",
  "What's our cash flow position?",
];

export default function SuggestionChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <img src="/brain-icon.png" alt="Brain" style={{ width: "64px", height: "64px" }} className="mb-4" />
      <h2 className="text-xl font-bold mb-1" style={{ color: "#1a2d1c" }}>OnePort 365 Brain</h2>
      <p className="text-sm mb-6" style={{ color: "#2d5225" }}>
        Your AI assistant for Commercial, Finance and Operations
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {suggestions.map((s) => (
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
  );
}
