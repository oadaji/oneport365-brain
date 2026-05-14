"use client";

export default function Navbar() {
  return (
    <nav className="h-14 flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: "#1a2d1c" }}>
      <div className="flex items-center gap-3">
        <img src="/oneport365-logo.png" alt="OnePort 365" style={{ height: "28px", width: "auto" }} />
        <span className="text-white font-bold text-sm tracking-tight">Brain</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: "#7dba6a",
            animation: "pulse-online 2s ease-in-out infinite",
          }}
        />
        <span className="text-xs font-medium" style={{ color: "#7dba6a" }}>Online</span>
      </div>
    </nav>
  );
}
