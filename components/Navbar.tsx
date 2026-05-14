"use client";

export default function Navbar() {
  return (
    <nav className="h-14 flex items-center justify-between px-5 shrink-0" style={{ backgroundColor: "#1a2d1c" }}>
      <div className="flex items-center gap-3">
        <img src="/oneport365-logo.png" alt="OnePort 365" style={{ height: "28px", width: "auto" }} />
        <span className="text-white font-bold text-sm tracking-tight">Brain</span>
      </div>
      <div />
    </nav>
  );
}
