"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message } from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import OnlineMembers, { OnlineMember } from "@/components/chat/OnlineMembers";
import AISummary from "@/components/chat/AISummary";
import { useGroup } from "@/lib/context/GroupContext";
import { pusherClient } from "@/lib/pusher-client";

const onlineMembers: OnlineMember[] = [
  { initials: "DR", color: "#CECBF6", textColor: "#3C3489", name: "Desi (you)", online: true },
  { initials: "FK", color: "#9FE1CB", textColor: "#085041", name: "Firhan", online: true },
  { initials: "AZ", color: "#F5C4B3", textColor: "#712B13", name: "Aziz", online: false },
];

export default function ChatPage() {
  const { activeGroup } = useGroup();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // useEffect 1 - fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.user._id);
      }
    };
    fetchCurrentUser();
  }, []);

  // useEffect 2 - pusher + fetch messages
  useEffect(() => {
    if (!activeGroup) return;

    fetchMessages();

    const channel = pusherClient.subscribe(`group-${activeGroup._id}`);

    channel.bind("new-message", (data: any) => {
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== data._id);
        const newMsg: Message = {
          id: data._id,
          name: data.senderId?.name || "Unknown",
          initials: data.senderId?.name
            ? data.senderId.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
            : "??",
          color: "#CECBF6",
          textColor: "#3C3489",
          message: data.content,
          time: new Date(data.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: data.senderId?._id === currentUserId,
          isBot: false,
        };
        return [...filtered, newMsg];
      });
    });

    channel.bind("reminder", (data: any) => {
      const reminderMsg: Message = {
        id: Date.now().toString(),
        name: "Reminder Bot",
        initials: "🤖",
        color: "#6C63FF",
        textColor: "white",
        message: "Upcoming deadline!",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
        isBot: true,
        reminders: [
          {
            title: data.title,
            date: new Date(data.remindAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time: new Date(data.remindAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            priority: "high",
          },
        ],
      };
      setMessages((prev) => [...prev, reminderMsg]);
    });

    return () => {
      pusherClient.unsubscribe(`group-${activeGroup._id}`);
    };
  }, [activeGroup, currentUserId]);

  // useEffect 3 - scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?groupId=${activeGroup._id}`);
      if (res.ok) {
        const data = await res.json();
        const formatted: Message[] = data.map((msg: any) => ({
          id: msg._id,
          name: msg.senderId?.name || "Unknown",
          initials: msg.senderId?.name
            ? msg.senderId.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
            : "??",
          color: "#CECBF6",
          textColor: "#3C3489",
          message: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: msg.senderId?._id === currentUserId,
          isBot: false,
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeGroup) return;

    const currentInput = input;
    setInput("");

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup._id,
          content: currentInput,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    if (currentInput.toLowerCase().includes("/remind")) {
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
            message: "Fetching reminders...",
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: false,
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  const handleSummary = async () => {
    if (!activeGroup) return;
    setLoadingSummary(true);
    setSummary("");
    try {
      const res = await fetch("/api/chat/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: activeGroup._id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!activeGroup) {
    return (
      <div className="flex h-screen items-center justify-center" data-theme="night">
        <div className="text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-white font-medium">No active group selected</p>
          <p className="text-base-content/50 text-sm">Select a group from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" data-theme="night">

      {/* Left Sidebar */}
      <div
        className="w-52 flex flex-col border-r border-white/10 flex-shrink-0"
        style={{ background: "#151528" }}
      >
        <div className="p-4 border-b border-white/10">
          <p className="text-xs text-base-content/40 uppercase tracking-wider font-medium">
            {activeGroup.name}
          </p>
        </div>

        {/* AI Features */}
        <div className="p-2 flex flex-col gap-1">
          <p className="text-xs text-base-content/40 uppercase tracking-wider px-2 py-1">
            AI Features
          </p>
          <button
            onClick={handleSummary}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-all hover:bg-white/5 ${
              loadingSummary ? "text-purple-400" : "text-base-content/50 hover:text-white"
            }`}
          >
            <span>✨</span>
            <span>{loadingSummary ? "Summarizing..." : "AI Summary"}</span>
          </button>
        </div>

        {/* Online Members */}
        <OnlineMembers members={onlineMembers} />
      </div>

      {/* Chat Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div
          className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0"
          style={{ background: "#1a1a2e" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">#general</span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="text-xs text-base-content/40">{activeGroup.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-white">🔍</button>
            <button className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-white">🔔</button>
          </div>
        </div>

        {/* AI Summary */}
        <AISummary summary={summary} onClose={() => setSummary("")} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
              <p className="text-4xl">💬</p>
              <p className="text-white text-sm">No messages yet</p>
              <p className="text-base-content/40 text-xs">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}

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