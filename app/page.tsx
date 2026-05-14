"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const chatRef = useRef<{ clearChat: () => void }>(null);

  return (
    <div className="flex flex-col h-full">
      <Navbar onLogoClick={() => chatRef.current?.clearChat()} />
      <ChatWindow ref={chatRef} />
    </div>
  );
}
