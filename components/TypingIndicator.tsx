"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: "#f0f7ef" }}>
        🧠
      </div>
      <div
        className="px-4 py-3 rounded-tr-2xl rounded-br-2xl rounded-tl-sm"
        style={{ backgroundColor: "#ffffff", border: "1px solid #d4e8d0" }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: "#3d7a2d",
                animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
