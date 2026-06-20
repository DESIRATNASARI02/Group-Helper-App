"use client";

export interface Channel {
  id: string;
  label: string;
  unread: number;
}

interface ChannelListProps {
  channels: Channel[];
  activeChannel: string;
  onSelect: (id: string) => void;
  onSummary: () => void;
  loadingSummary: boolean;
}

export default function ChannelList({
  channels,
  activeChannel,
  onSelect,
  onSummary,
  loadingSummary,
}: ChannelListProps) {
  return (
    <div className="p-2 flex flex-col gap-1 flex-1">
      <p className="text-xs text-base-content/40 uppercase tracking-wider px-2 py-1">
        Channels
      </p>
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => onSelect(ch.id)}
          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all w-full text-left ${
            activeChannel === ch.id
              ? "text-white font-medium"
              : "text-base-content/50 hover:text-white hover:bg-white/5"
          }`}
          style={activeChannel === ch.id ? { background: "rgba(108,99,255,0.3)" } : {}}
        >
          <span>{ch.label}</span>
          {ch.unread > 0 && (
            <span className="badge badge-sm text-white" style={{ background: "#6C63FF" }}>
              {ch.unread}
            </span>
          )}
        </button>
      ))}

      {/* AI Features */}
      <div className="mt-2 border-t border-white/10 pt-2">
        <p className="text-xs text-base-content/40 uppercase tracking-wider px-2 py-1">
          AI Features
        </p>
        <button
          onClick={onSummary}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-all hover:bg-white/5 ${
            loadingSummary ? "text-purple-400" : "text-base-content/50 hover:text-white"
          }`}
        >
          <span>✨</span>
          <span>{loadingSummary ? "Summarizing..." : "AI Summary"}</span>
        </button>
      </div>
    </div>
  );
}