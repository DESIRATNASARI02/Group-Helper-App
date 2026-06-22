"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  deadline?: string;
  groupId: string;
}

const priorityConfig: Record<string, { color: string; bg: string }> = {
  low: { color: "#888780", bg: "#F1EFE8" },
  medium: { color: "#534AB7", bg: "#EEEDFE" },
  high: { color: "#854F0B", bg: "#FAEEDA" },
  urgent: { color: "#A32D2D", bg: "#FCEBEB" },
};

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#888780", bg: "#F1EFE820" },
  in_progress: { label: "In Progress", color: "#EF9F27", bg: "#FAEEDA20" },
  completed: { label: "Completed", color: "#1D9E75", bg: "#E1F5EE20" },
};

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const statusOrder: TaskStatus[] = ["pending", "in_progress", "completed"];

export default function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const currentIndex = statusOrder.indexOf(task.status);
  const priority = task.priority || "medium";
  const { color, bg } = priorityConfig[priority];
  const statusInfo = statusConfig[task.status];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 border border-white/5 hover:border-white/20 transition-all"
      style={{ background: "#1e1e3a" }}
    >
      {/* Priority + Move */}
      <div className="flex items-center justify-between">
        <Badge
          label={priority.charAt(0).toUpperCase() + priority.slice(1)}
          color={color}
          bg={bg}
        />
        <div className="flex gap-1 items-center">
          {currentIndex > 0 && (
            <button
              className="text-xs text-base-content/30 hover:text-white px-1"
              onClick={() => onMove(task._id, statusOrder[currentIndex - 1])}
            >
              ←
            </button>
          )}
          {currentIndex < statusOrder.length - 1 && (
            <button
              className="text-xs text-base-content/30 hover:text-white px-1"
              onClick={() => onMove(task._id, statusOrder[currentIndex + 1])}
            >
              →
            </button>
          )}
          <button
            className="text-xs text-base-content/30 hover:text-error px-1"
            onClick={() => onDelete(task._id)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Title */}
      <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-base-content/40" : "text-white"}`}>
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-base-content/50 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        {task.deadline && (
          <span className="text-xs text-base-content/40">
            📅 {formatDeadline(task.deadline)}
          </span>
        )}
        <div className="ml-auto">
          <Avatar
            initials={getInitials(task.createdBy?.name || "?")}
            color="#CECBF6"
            textColor="#3C3489"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}