"use client";

import { useState } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import ReminderCard from "@/components/reminders/ReminderCard";
import ReminderForm from "@/components/reminders/ReminderForm";

interface Reminder {
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
}

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "GC02 Final Submission",
    description: "Submit Group Helper project to Hacktiv8 portal",
    dueDate: "Jun 18, 2026",
    dueTime: "18:00",
    priority: "high",
    isDone: false,
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
  },
  {
    id: "2",
    title: "Live Code Exam",
    description: "Phase 3 live code assessment",
    dueDate: "Jun 19, 2026",
    dueTime: "09:00",
    priority: "high",
    isDone: false,
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
  },
  {
    id: "3",
    title: "Study Session Tonight",
    description: "Review MongoDB aggregation pipeline",
    dueDate: "Jun 20, 2026",
    dueTime: "20:00",
    priority: "medium",
    isDone: false,
    assignee: "FK",
    assigneeColor: "#9FE1CB",
    assigneeTextColor: "#085041",
  },
  {
    id: "4",
    title: "Push auth branch to GitHub",
    dueDate: "Jun 17, 2026",
    dueTime: "12:00",
    priority: "medium",
    isDone: true,
    assignee: "DR",
    assigneeColor: "#CECBF6",
    assigneeTextColor: "#3C3489",
  },
];

const filters = ["All", "Active", "Done"];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = reminders.filter((r) => {
    if (activeFilter === "Active") return !r.isDone;
    if (activeFilter === "Done") return r.isDone;
    return true;
  });

  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDone: !r.isDone } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAdd = (data: {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "low" | "medium" | "high";
  }) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      ...data,
      isDone: false,
      assignee: "DR",
      assigneeColor: "#CECBF6",
      assigneeTextColor: "#3C3489",
    };
    setReminders((prev) => [newReminder, ...prev]);
    setShowModal(false);
  };

  const activeCount = reminders.filter((r) => !r.isDone).length;
  const doneCount = reminders.filter((r) => r.isDone).length;

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Reminders"
        subtitle={`${activeCount} active · ${doneCount} done`}
        actions={
          <button
            className="btn btn-sm text-white font-medium"
            style={{ background: "#6C63FF" }}
            onClick={() => setShowModal(true)}
          >
            + Add Reminder
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: reminders.length, color: "#6C63FF" },
          { label: "Active", value: activeCount, color: "#EF9F27" },
          { label: "Done", value: doneCount, color: "#1D9E75" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
            <p className="text-xs text-base-content/50 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`btn btn-sm ${activeFilter === f ? "text-white" : "btn-outline"}`}
            style={activeFilter === f ? { background: "#6C63FF", border: "none" } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔔</p>
            <p className="text-white font-medium">No reminders found</p>
            <p className="text-base-content/50 text-sm mt-1">Add a new reminder to get started</p>
          </div>
        ) : (
          filtered.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              {...reminder}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Reminder"
      >
        <ReminderForm
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      </Modal>

    </div>
  );
}