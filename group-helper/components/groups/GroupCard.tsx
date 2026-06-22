"use client";

interface GroupCardProps {
  id: string;
  name: string;
  description?: string;
  topic?: string;
  memberCount: number;
  onAction: (id: string) => void;
  actionLabel: string;
  actionColor?: string;
  loading?: boolean;
}

const topicColors: Record<string, string> = {
  MongoDB: "#1D9E75",
  "Next.js": "#6C63FF",
  React: "#61DAFB",
  TypeScript: "#3178C6",
  "Node.js": "#68A063",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  default: "#EF9F27",
};

export default function GroupCard({
  id,
  name,
  description,
  topic,
  memberCount,
  onAction,
  actionLabel,
  actionColor = "#6C63FF",
  loading = false,
}: GroupCardProps) {
  const color = topic ? topicColors[topic] || topicColors["default"] : topicColors["default"];

  return (
    <div
      className="rounded-xl p-5 border border-white/10 flex flex-col gap-3 hover:border-purple-500/50 transition-all"
      style={{ background: "#1e1e3a" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="badge badge-sm text-white font-medium"
          style={{ background: color }}
        >
          {topic || "General"}
        </span>
        <span className="text-xs text-base-content/40">
          👥 {memberCount} members
        </span>
      </div>

      <div>
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <p className="text-base-content/50 text-sm mt-1 line-clamp-2">
          {description || "No description provided"}
        </p>
      </div>

      <button
        onClick={() => onAction(id)}
        className={`btn btn-sm w-full text-white font-medium mt-auto ${loading ? "loading" : ""}`}
        style={{ background: actionColor }}
        disabled={loading}
      >
        {loading ? "Loading..." : actionLabel}
      </button>
    </div>
  );
}