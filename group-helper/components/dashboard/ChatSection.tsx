import Link from "next/link";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import ReactMarkdown from "react-markdown";

interface Message {
  _id: string;
  content: string;
  senderId: { _id: string; name: string };
  createdAt: string;
  isAI?: boolean; 
}

interface ChatSectionProps {
  messages: Message[];
  loading: boolean;
  currentUserId: string;
}

export default function ChatSection({ messages, loading, currentUserId }: ChatSectionProps) {
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const recentMessages = messages.slice(-3).reverse();

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white text-sm">💬 Recent Chat</h2>
        <Link href="/dashboard/chat">
          <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>Open chat</span>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : recentMessages.length === 0 ? (
        <p className="text-base-content/40 text-sm text-center py-4">No messages yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {recentMessages.map((msg) => {
            const isMe = !msg.isAI && msg.senderId?._id === currentUserId;
            const isAI = msg.isAI || false; 

            return (
              <div key={msg._id} className={`flex gap-2 items-start ${isMe ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                {isAI ? ( 
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "#6C63FF", color: "white" }}
                  >
                    AI
                  </div>
                ) : (
                  <Avatar
                    initials={getInitials(msg.senderId?.name || "?")}
                    color="#CECBF6"
                    textColor="#3C3489"
                    size="sm"
                  />
                )}

                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {/* Name */}
                  <p className="text-xs mb-1" style={{ color: isAI ? "#a78bfa" : "rgba(255,255,255,0.4)" }}>
                    {isAI ? "✨ AI Assistant" : isMe ? "You" : msg.senderId?.name} {/* <== */}
                  </p>

                  {/* Bubble */}
                  <div
                    className="text-xs px-3 py-2 rounded-lg text-white max-w-xs prose prose-invert prose-xs [&>*]:mb-2 [&>*:last-child]:mb-0"
                    style={{
                      background: isMe ? "#6C63FF" : isAI ? "#2a1f5e" : "#2a2a4a", 
                    }}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}