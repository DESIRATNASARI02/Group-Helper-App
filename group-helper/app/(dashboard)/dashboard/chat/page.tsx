"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message } from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import OnlineMembers, { OnlineMember } from "@/components/chat/OnlineMembers";
import { useGroup } from "@/lib/context/GroupContext";
import { pusherClient } from "@/lib/pusher-client";

export default function ChatPage() {
    const { activeGroup } = useGroup();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<OnlineMember[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aiError, setAiError] = useState(""); 
    const bottomRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!activeGroup) return;
        const fetchMembers = async () => {
            const res = await fetch(`/api/groups/${activeGroup._id}/members`);
            if (res.ok) {
                const data = await res.json();
                const formatted = data.members?.map((m: any) => ({
                    initials: m.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??",
                    color: m.avatarColor || "#CECBF6",
                    textColor: "#3C3489",
                    name: m.name || "Unknown",
                    online: true,
                })) || [];
                setGroupMembers(formatted);
            }
        };
        fetchMembers();
    }, [activeGroup]);

    useEffect(() => {
        if (!activeGroup) return;

        fetchMessages();

        const channel = pusherClient.subscribe(`group-${activeGroup._id}`);

        channel.bind("new-message", (data: any) => {
            setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== data._id);
                const newMsg: Message = {
                    id: data._id,
                    name: data.isAI ? "✨ AI Assistant" : data.senderId?.name || "Unknown",
                    initials: data.isAI ? "AI" : data.senderId?.name
                        ? data.senderId.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                        : "??",
                    color: data.isAI ? "#6C63FF" : "#CECBF6",
                    textColor: data.isAI ? "white" : "#3C3489",
                    message: data.content,
                    time: new Date(data.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isMe: false,
                    isBot: data.isAI || false,
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
                    name: msg.isAI ? "✨ AI Assistant" : msg.senderId?.name || "Unknown",
                    initials: msg.isAI ? "AI" : msg.senderId?.name
                        ? msg.senderId.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                        : "??",
                    color: msg.isAI ? "#6C63FF" : "#CECBF6",
                    textColor: msg.isAI ? "white" : "#3C3489",
                    message: msg.content,
                    time: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isMe: !msg.isAI && msg.senderId?._id === currentUserId,
                    isBot: msg.isAI || false,
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
        setAiError(""); 
        try {
            const res = await fetch("/api/chat/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId: activeGroup._id }),
            });

            const data = await res.json();

            if (!res.ok) { 
                setAiError(data.message || "Terjadi kesalahan pada AI.");
                return;
            }

            const sendRes = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId: activeGroup._id,
                    content: `✨ AI Summary\n\n${data.summary}`,
                    isAI: true,
                }),
            });

            if (!sendRes.ok) {
                setAiError("Gagal mengirim ringkasan. Silakan coba lagi.");
            }
        } catch (err) {
            console.error(err);
            setAiError("Terjadi kesalahan. Silakan coba lagi."); 
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
                <OnlineMembers members={groupMembers} />
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

                {/* AI Error Alert */} {/* <== */}
                {aiError && (
                    <div className="mx-4 mt-3 alert alert-error text-sm py-2 flex justify-between">
                        <span>⚠️ {aiError}</span>
                        <button
                            className="ml-auto text-xs"
                            onClick={() => setAiError("")}
                        >
                            ✕
                        </button>
                    </div>
                )}

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