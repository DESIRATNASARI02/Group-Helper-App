interface Reminder {
  title: string;
  date: string;
  time: string;
  priority: "high" | "medium" | "low";
}

interface ReminderCardProps {
  reminders: Reminder[];
}

const priorityColors = {
  high: "#E24B4A",
  medium: "#EF9F27",
  low: "#1D9E75",
};

export default function ReminderCard({ reminders }: ReminderCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-purple-500/30 max-w-xs"
      style={{ background: "#1e1e3a" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{ background: "#2a1f5e" }}
      >
        <span>🔔</span>
        <span className="text-white text-sm font-medium">Upcoming Deadlines</span>
      </div>

      {/* Reminder Items */}
      <div className="p-3 flex flex-col gap-2">
        {reminders.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg border border-white/5"
            style={{ background: "#2a2a4a" }}
          >
            <div
              className="w-1 h-10 rounded-full flex-shrink-0"
              style={{ background: priorityColors[r.priority] }}
            />
            <div className="flex-1">
              <p className="text-white text-xs font-medium">{r.title}</p>
              <p className="text-base-content/40 text-xs mt-0.5">
                📅 {r.date} · 🕐 {r.time}
              </p>
            </div>
            <span
              className="badge badge-xs"
              style={{
                background: `${priorityColors[r.priority]}20`,
                color: priorityColors[r.priority],
              }}
            >
              {r.priority}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10">
        <p className="text-xs text-base-content/30 text-center">
          Powered by Group Helper Bot
        </p>
      </div>
    </div>
  );
}