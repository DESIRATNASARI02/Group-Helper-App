"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import KanbanColumn from "@/components/tasks/KanbanColumn";
import { Task, TaskStatus } from "@/components/tasks/TaskCard";
import { useGroup } from "@/lib/context/GroupContext";

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const columns = [
  { id: "pending" as TaskStatus, label: "Pending", color: "#888780", bg: "#F1EFE820" },
  { id: "in_progress" as TaskStatus, label: "In Progress", color: "#EF9F27", bg: "#FAEEDA20" },
  { id: "completed" as TaskStatus, label: "Completed", color: "#1D9E75", bg: "#E1F5EE20" },
];

const priorityColors: Record<string, string> = {
  low: "#888780",
  medium: "#534AB7",
  high: "#854F0B",
  urgent: "#A32D2D",
};

const priorityBg: Record<string, string> = {
  low: "#F1EFE8",
  medium: "#EEEDFE",
  high: "#FAEEDA",
  urgent: "#FCEBEB",
};

export default function TasksPage() {
  const { activeGroup } = useGroup();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    assignedTo: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeGroup) {
      fetchTasks();
      fetchMembers();
    }
  }, [activeGroup]);

  const fetchTasks = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?groupId=${activeGroup._id}`);
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!activeGroup) return;
    try {
      const res = await fetch(`/api/groups/${activeGroup._id}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleMove = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleView = (task: Task) => {
    setViewTask(task);
    setShowViewModal(true);
  };

  const handleAddTask = async () => {
    if (!newTask.title || !activeGroup || !newTask.priority || !newTask.assignedTo) return;

    const assignedToId = newTask.assignedTo === "me" ? user?._id : newTask.assignedTo;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup._id,
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline || undefined,
          priority: newTask.priority,
          assignedTo: assignedToId || undefined,
        }),
      });
      if (res.ok) {
        fetchTasks();
        setNewTask({ title: "", description: "", deadline: "", priority: "", assignedTo: "" });
        setShowAddModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!activeGroup) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 gap-4" data-theme="night">
        <p className="text-4xl">👥</p>
        <p className="text-white font-medium">No active group selected</p>
        <p className="text-base-content/50 text-sm">Select a group from the sidebar to view tasks</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Tasks"
        subtitle={`${activeGroup.name} · ${tasks.length} tasks`}
        actions={
          <button
            className="btn btn-sm text-white font-medium"
            style={{ background: "#6C63FF" }}
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 overflow-x-auto">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              bg={col.bg}
              tasks={getTasksByStatus(col.id)}
              onMove={handleMove}
              onDelete={handleDelete}
              onView={handleView}
              onAddTask={() => setShowAddModal(true)}
            />
          ))}
        </div>
      )}

      {/* Modal Add Task */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
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
              <option value="" disabled>Select priority...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white">Deadline</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Assign To</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          >
            <option value="" disabled>Assign to member...</option>
            <option value="me">Me</option>
            {members
              .filter((m) => m._id !== user?._id)
              .map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            className="btn btn-outline flex-1"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn flex-1 text-white font-bold"
            style={{ background: "#6C63FF" }}
            onClick={handleAddTask}
            disabled={!newTask.title || !newTask.priority || !newTask.assignedTo}
          >
            Add Task
          </button>
        </div>
      </Modal>

      {/* Modal View Task */}
      {viewTask && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Task Detail"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              <span
                className="badge badge-sm font-medium"
                style={{
                  background: priorityBg[viewTask.priority || "medium"],
                  color: priorityColors[viewTask.priority || "medium"],
                }}
              >
                {(viewTask.priority || "medium").charAt(0).toUpperCase() + (viewTask.priority || "medium").slice(1)}
              </span>
              <span
                className="badge badge-sm text-white font-medium"
                style={{
                  background: viewTask.status === "completed" ? "#1D9E75" : viewTask.status === "in_progress" ? "#EF9F27" : "#888780"
                }}
              >
                {viewTask.status === "in_progress" ? "In Progress" : viewTask.status.charAt(0).toUpperCase() + viewTask.status.slice(1)}
              </span>
            </div>

            <h3 className="text-white font-bold text-lg">{viewTask.title}</h3>

            {viewTask.description && (
              <div
                className="rounded-lg p-3 text-sm text-base-content/70 whitespace-pre-line"
                style={{ background: "#2a2a4a" }}
              >
                {viewTask.description}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-1">
              {viewTask.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base-content/40">📅 Deadline:</span>
                  <span className="text-white">
                    {new Date(viewTask.deadline).toLocaleDateString("en-US", {
                      month: "long", day: "numeric", year: "numeric"
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
              <span className="text-base-content/40">👤 Assigned to:</span>
              <span className="text-white">
                {viewTask.assignedTo?._id === user?._id
                  ? "Me"
                  : viewTask.assignedTo?.name || "Me"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-base-content/40">✏️ Created by:</span>
              <span className="text-white">
                {viewTask.createdBy?._id === user?._id
                  ? "Me"
                  : viewTask.createdBy?.name}
              </span>
              </div>
            </div>
          </div>

          <button
            className="btn w-full mt-4 text-white"
            style={{ background: "#6C63FF" }}
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </Modal>
      )}

    </div>
  );
}