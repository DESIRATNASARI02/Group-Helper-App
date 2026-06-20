"use client";

import { useState } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import KanbanColumn from "@/components/tasks/KanbanColumn";
import { Task, TaskStatus } from "@/components/tasks/TaskCard";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup login & register page",
    status: "todo",
    priority: "medium",
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
    due: "Jun 18",
  },
  {
    id: "2",
    title: "Integrate reminder bot to chat",
    status: "todo",
    priority: "urgent",
    assignee: "FK",
    assigneeColor: "#9FE1CB",
    assigneeTextColor: "#085041",
    due: "Jun 17",
  },
  {
    id: "3",
    title: "Implement JWT auth in Next.js",
    description: "Create middleware to protect routes and handle token refresh.",
    status: "in-progress",
    priority: "high",
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
    due: "Jun 17",
  },
  {
    id: "4",
    title: "Design MongoDB schema",
    status: "in-progress",
    priority: "medium",
    assignee: "FK",
    assigneeColor: "#9FE1CB",
    assigneeTextColor: "#085041",
    due: "Jun 16",
  },
  {
    id: "5",
    title: "UI Dashboard & Sidebar",
    description: "Waiting for Captain review before merge to main.",
    status: "review",
    priority: "medium",
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
    due: "Jun 16",
  },
  {
    id: "6",
    title: "Setup Next.js project",
    status: "done",
    priority: "low",
    assignee: "FK",
    assigneeColor: "#9FE1CB",
    assigneeTextColor: "#085041",
    due: "Jun 14",
  },
];

const columns = [
  { id: "todo" as TaskStatus, label: "Todo", color: "#888780", bg: "#F1EFE820" },
  { id: "in-progress" as TaskStatus, label: "In Progress", color: "#EF9F27", bg: "#FAEEDA20" },
  { id: "review" as TaskStatus, label: "Review", color: "#378ADD", bg: "#E6F1FB20" },
  { id: "done" as TaskStatus, label: "Done", color: "#1D9E75", bg: "#E1F5EE20" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due: "",
  });

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleMove = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority as Task["priority"],
      assignee: "DR",
      assigneeColor: "#CECBF6",
      assigneeTextColor: "#3C3489",
      due: newTask.due,
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "", priority: "medium", due: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Tasks"
        subtitle={`Hacktiv8 Phase 3 · ${tasks.length} tasks`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <button
                className="px-3 py-1.5 text-xs font-medium text-white"
                style={{ background: "rgba(108,99,255,0.3)" }}
              >
                🗂 Kanban
              </button>
              <button className="px-3 py-1.5 text-xs text-base-content/50 hover:text-white">
                📋 List
              </button>
            </div>
            <button
              className="btn btn-sm text-white font-medium"
              style={{ background: "#6C63FF" }}
              onClick={() => setShowModal(true)}
            >
              + Add Task
            </button>
          </div>
        }
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            bg={col.bg}
            tasks={getTasksByStatus(col.id)}
            onMove={handleMove}
            onAddTask={() => setShowModal(true)}
          />
        ))}
      </div>

      {/* Modal Add Task */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Task"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Title</span>
          </label>
          <input
            type="text"
            placeholder="Task title..."
            className="input input-bordered w-full"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Description</span>
            <span className="label-text-alt text-base-content/40">Optional</span>
          </label>
          <textarea
            placeholder="Task description..."
            className="textarea textarea-bordered w-full resize-none h-20"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Priority</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Due Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={newTask.due}
              onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            className="btn btn-outline flex-1"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn flex-1 text-white font-bold"
            style={{ background: "#6C63FF" }}
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </Modal>

    </div>
  );
}