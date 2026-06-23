"use client";

import TaskCard, { Task, TaskStatus } from "@/components/tasks/TaskCard";

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  bg: string;
  tasks: Task[];
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onAddTask: () => void;
}

export default function KanbanColumn({
  label,
  color,
  bg,
  tasks,
  onMove,
  onDelete,
  onView,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-3 min-w-48">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }}></div>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <span
          className="badge badge-sm font-medium"
          style={{ background: bg, color }}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 min-h-32">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onMove={onMove}
            onDelete={onDelete}
            onView={onView}
          />
        ))}

        <button
          className="w-full py-2 rounded-lg border border-dashed border-white/10 text-xs text-base-content/30 hover:text-white hover:border-white/30 transition-all"
          onClick={onAddTask}
        >
          + Add task
        </button>
      </div>
    </div>
  );
}