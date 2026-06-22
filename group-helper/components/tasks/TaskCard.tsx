"use client";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeColor: string;
  assigneeTextColor: string;
  due?: string;
}

const priorityConfig: Record<TaskPriority, { color: string; bg: string }> = {
  low: { color: "#888780", bg: "#F1EFE8" },
  medium: { color: "#534AB7", bg: "#EEEDFE" },
  high: { color: "#854F0B", bg: "#FAEEDA" },
  urgent: { color: "#A32D2D", bg: "#FCEBEB" },
};

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
}

const statusOrder: TaskStatus[] = ["todo", "in-progress", "review", "done"];

export default function TaskCard({ task, onMove }: TaskCardProps) {
  const currentIndex = statusOrder.indexOf(task.status);
  const { color, bg } = priorityConfig[task.priority];

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 border border-white/5 hover:border-white/20 transition-all"
      style={{ background: "#1e1e3a" }}
    >
      {/* Priority + Move */}
      <div className="flex items-center justify-between">
        <Badge
          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          color={color}
          bg={bg}
        />
        <div className="flex gap-1">
          {currentIndex > 0 && (
            <button
              className="text-xs text-base-content/30 hover:text-white px-1"
              onClick={() => onMove(task.id, statusOrder[currentIndex - 1])}
            >
              ←
            </button>
          )}
          {currentIndex < statusOrder.length - 1 && (
            <button
              className="text-xs text-base-content/30 hover:text-white px-1"
              onClick={() => onMove(task.id, statusOrder[currentIndex + 1])}
            >
              →
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-base-content/40" : "text-white"}`}>
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
        {task.due && (
          <span className="text-xs text-base-content/40">
            📅 {task.due}
          </span>
        )}
        <div className="ml-auto">
          <Avatar
            initials={task.assignee}
            color={task.assigneeColor}
            textColor={task.assigneeTextColor}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}