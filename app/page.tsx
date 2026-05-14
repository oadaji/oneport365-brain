import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <ChatWindow />
    </div>
  );
}
