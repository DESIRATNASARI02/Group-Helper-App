import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Task {
  _id: string;
  title: string;
  status: string;
}

const statusBadgeConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#888780", bg: "#F1EFE8" },
  in_progress: { label: "In Progress", color: "white", bg: "#EF9F27" },
  completed: { label: "Completed", color: "white", bg: "#1D9E75" },
};

interface TasksSectionProps {
  tasks: Task[];
  loading: boolean;
}

export default function TasksSection({ tasks, loading }: TasksSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white text-sm">✅ Shared Tasks</h2>
        <Link href="/dashboard/tasks">
          <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>See all</span>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-base-content/40 text-sm text-center py-4">No tasks yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.slice(0, 4).map((task) => {
            const badge = statusBadgeConfig[task.status] || statusBadgeConfig["pending"];
            return (
              <div key={task._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                  style={task.status === "completed"
                    ? { background: "#1D9E75", borderColor: "#1D9E75" }
                    : { borderColor: "rgba(255,255,255,0.2)" }
                  }
                >
                  {task.status === "completed" && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`flex-1 text-sm ${task.status === "completed" ? "line-through text-base-content/40" : "text-white"}`}>
                  {task.title}
                </span>
                <Badge label={badge.label} color={badge.color} bg={badge.bg} />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}