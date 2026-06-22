interface ScheduleCardProps {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "study" | "review" | "exam" | "meeting";
  members: string;
  color: string;
  onDelete: (id: string) => void;
}

const typeConfig = {
  study: { label: "Study Session", color: "#6C63FF", bg: "#EEEDFE20" },
  review: { label: "Review", color: "#1D9E75", bg: "#E1F5EE20" },
  exam: { label: "Exam", color: "#E24B4A", bg: "#FCEBEB20" },
  meeting: { label: "Meeting", color: "#EF9F27", bg: "#FAEEDA20" },
};

export default function ScheduleCard({
  id,
  title,
  description,
  date,
  startTime,
  endTime,
  type,
  members,
  color,
  onDelete,
}: ScheduleCardProps) {
  const { label, bg } = typeConfig[type];

  return (
    <div
      className="rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all flex gap-4"
      style={{ background: "#1e1e3a", borderLeft: `3px solid ${color}` }}
    >
      {/* Time */}
      <div className="flex flex-col items-center justify-center min-w-16 text-center">
        <span className="text-white font-bold text-sm">{startTime}</span>
        <div className="w-px h-4 bg-white/20 my-1"></div>
        <span className="text-base-content/40 text-xs">{endTime}</span>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/10 flex-shrink-0"></div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white font-semibold text-sm">{title}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="badge badge-sm font-medium"
              style={{ background: bg, color }}
            >
              {label}
            </span>
            <button
              onClick={() => onDelete(id)}
              className="text-base-content/30 hover:text-error text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {description && (
          <p className="text-xs text-base-content/50 mt-1">{description}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-base-content/40">📅 {date}</span>
          <span className="text-xs text-base-content/40">👥 {members}</span>
        </div>
      </div>
    </div>
  );
}