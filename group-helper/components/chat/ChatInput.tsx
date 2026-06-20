"use client";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="p-4 border-t border-white/10 .flex-shrink-0"
      style={{ background: "#1a1a2e" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
        style={{ background: "#2a2a4a" }}
      >
        <input
          type="text"
          placeholder="Type a message or /remind..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-base-content/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-sm text-white px-4"
          style={{ background: "#6C63FF" }}
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}