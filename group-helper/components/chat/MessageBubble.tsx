import Avatar from "@/components/ui/Avatar";
import ReminderCard from "@/components/chat/ReminderCard";
import ReactMarkdown from "react-markdown";

export interface Reminder {
    title: string;
    date: string;
    time: string;
    priority: "high" | "medium" | "low";
}

export interface Message {
    id: string;
    name: string;
    initials: string;
    color: string;
    textColor: string;
    message: string;
    time: string;
    isMe: boolean;
    isBot: boolean;
    reminders?: Reminder[];
}

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message: msg }: MessageBubbleProps) {
    return (
        <div className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
            <Avatar
                initials={msg.initials}
                color={msg.color}
                textColor={msg.textColor}
                size="md"
            />
            <div
                className={`flex flex-col max-w-sm ${msg.isMe ? "items-end" : "items-start"}`}
            >
                <div className="flex items-baseline gap-2 mb-1">
                    {!msg.isMe && (
                        <span
                            className={`text-sm font-medium ${msg.isBot ? "text-purple-400" : "text-white"}`}
                        >
                            {msg.name}
                        </span>
                    )}
                    {msg.isBot && (
                        <span
                            className="badge badge-xs"
                            style={{ background: "#EEEDFE", color: "#534AB7" }}
                        >
                            BOT
                        </span>
                    )}
                    <span className="text-xs text-base-content/30">
                        {msg.time}
                    </span>
                </div>

                {/* Reminder Card */}
                {msg.reminders && msg.reminders.length > 0 ? (
                    <ReminderCard reminders={msg.reminders} />
                ) : (
                    <div
                        className="px-4 py-2 text-sm text-white whitespace-pre-line"
                        style={{
                            background: msg.isMe
                                ? "#6C63FF"
                                : msg.isBot
                                  ? "#2a1f5e"
                                  : "#2a2a4a",
                            borderRadius: msg.isMe
                                ? "18px 4px 18px 18px"
                                : "4px 18px 18px 18px",
                        }}
                    >
                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
