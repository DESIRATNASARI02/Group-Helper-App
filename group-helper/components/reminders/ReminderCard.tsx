interface ReminderCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  priority: "low" | "medium" | "high";
  isDone: boolean;
  assignee: string;
  assigneeColor: string;
  assigneeTextColor: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: { color: "#888780", bg: "#F1EFE820", label: "Low" },
  medium: { color: "#6C63FF", bg: "#EEEDFE20", label: "Medium" },
  high: { color: "#E24B4A", bg: "#FCEBEB20", label: "High" },
};

export default function ReminderCard({
  id,
  title,
  description,
  dueDate,
  dueTime,
  priority,
  isDone,
  assignee,
  assigneeColor,
  assigneeTextColor,
  onToggle,
  onDelete,
}: ReminderCardProps) {
  const { color, bg, label } = priorityConfig[priority];

  return (
    <div
      className={`rounded-xl p-4 border transition-all ${
        isDone ? "opacity-50 border-white/5" : "border-white/10 hover:border-white/20"
      }`}
      style={{ background: "#1e1e3a" }}
    >
      <div className="flex items-start gap-3">

        {/* Checkbox */}
        <button
          onClick={() => onToggle(id)}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: isDone ? "#1D9E75" : color,
            background: isDone ? "#1D9E75" : "transparent",
          }}
        >
          {isDone && <span className="text-white text-xs">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-sm font-medium ${isDone ? "line-through text-base-content/40" : "text-white"}`}>
              {title}
            </p>
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
            <span className="text-xs text-base-content/40 flex items-center gap-1">
              📅 {dueDate}
            </span>
            <span className="text-xs text-base-content/40 flex items-center gap-1">
              🕐 {dueTime}
            </span>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-auto"
              style={{ background: assigneeColor, color: assigneeTextColor }}
            >
              {assignee}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}