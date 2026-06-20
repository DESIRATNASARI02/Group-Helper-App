"use client";

import { useState, useRef, useEffect } from "react";
import ChannelList, { Channel } from "@/components/chat/ChannelList";
import MessageBubble, { Message } from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import OnlineMembers, { OnlineMember } from "@/components/chat/OnlineMembers";
import AISummary from "@/components/chat/AISummary";

const initialMessages: Message[] = [
  {
    id: "1",
    name: "Firhan",
    initials: "FK",
    color: "#9FE1CB",
    textColor: "#085041",
    message: "Have you pushed the auth branch yet?",
    time: "09:14",
    isMe: false,
    isBot: false,
  },
  {
    id: "2",
    name: "You",
    initials: "DR",
    color: "#CECBF6",
    textColor: "#3C3489",
    message: "Yes, check the PR 🙏",
    time: "09:16",
    isMe: true,
    isBot: false,
  },
  {
    id: "3",
    name: "Reminder Bot",
    initials: "🤖",
    color: "#6C63FF",
    textColor: "white",
    message: "Reminder: GC02 deadline tomorrow at 18:00!",
    time: "09:17",
    isMe: false,
    isBot: true,
  },
  {
    id: "4",
    name: "Aziz",
    initials: "AZ",
    color: "#F5C4B3",
    textColor: "#712B13",
    message: "Is tonight's session still on?",
    time: "09:20",
    isMe: false,
    isBot: false,
  },
];

const channels: Channel[] = [
  { id: "general", label: "#general", unread: 3 },
  { id: "study", label: "#study", unread: 0 },
  { id: "announcements", label: "#announcements", unread: 0 },
];

const onlineMembers: OnlineMember[] = [
  { initials: "DR", color: "#CECBF6", textColor: "#3C3489", name: "Desi (you)", online: true },
  { initials: "FK", color: "#9FE1CB", textColor: "#085041", name: "Firhan", online: true },
  { initials: "AZ", color: "#F5C4B3", textColor: "#712B13", name: "Aziz", online: false },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      name: "You",
      initials: "DR",
      color: "#CECBF6",
      textColor: "#3C3489",
      message: input,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      isBot: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (input.toLowerCase().includes("/remind")) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            name: "Reminder Bot",
            initials: "🤖",
            color: "#6C63FF",
            textColor: "white",
            message: "📋 Upcoming deadlines:\n• GC02 submission — Jun 18, 18:00\n• Live code exam — Jun 19, 09:00\n• Study session tonight — 20:00",
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            isMe: false,
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  const handleSummary = async () => {
    setLoadingSummary(true);
    setSummary("");
    try {
      // nanti connect ke /api/chat/summary dengan Gemini
      await new Promise((r) => setTimeout(r, 1500));
      setSummary(
        "📌 Chat Summary:\n• Firhan asked about auth branch push status\n• Desi confirmed PR is ready for review\n• Bot reminded about GC02 deadline tomorrow at 18:00\n• Aziz asked if tonight's study session is still on"
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="flex h-screen" data-theme="night">

      {/* Channel List */}
      <div
        className="w-52 flex flex-col border-r border-white/10 .flex-shrink-0"
        style={{ background: "#151528" }}
      >
        <div className="p-4 border-b border-white/10">
          <p className="text-xs text-base-content/40 uppercase tracking-wider font-medium">
            Study Group
          </p>
        </div>

        <ChannelList
          channels={channels}
          activeChannel={activeChannel}
          onSelect={setActiveChannel}
          onSummary={handleSummary}
          loadingSummary={loadingSummary}
        />

        <OnlineMembers members={onlineMembers} />
      </div>

      {/* Chat Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div
          className="p-4 border-b border-white/10 flex items-center justify-between .flex-shrink-0"
          style={{ background: "#1a1a2e" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">#{activeChannel}</span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="text-xs text-base-content/40">6 members</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-white">🔍</button>
            <button className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-white">🔔</button>
            <button className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-white">👥</button>
          </div>
        </div>

        {/* AI Summary */}
        <AISummary summary={summary} onClose={() => setSummary("")} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: "#6C63FF" }}
              >
                🤖
              </div>
              <div
                className="px-4 py-3"
                style={{ background: "#2a1f5e", borderRadius: "4px 18px 18px 18px" }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}