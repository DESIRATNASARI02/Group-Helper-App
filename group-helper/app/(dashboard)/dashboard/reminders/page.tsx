"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import ReminderCard from "@/components/reminders/ReminderCard";
import ReminderForm from "@/components/reminders/ReminderForm";
import { useGroup } from "@/lib/context/GroupContext";

interface Reminder {
  _id: string;
  title: string;
  description?: string;
  remindAt: string;
  isSent: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  groupId: string;
}

const filters = ["All", "Active", "Done"];

export default function RemindersPage() {
  const { activeGroup } = useGroup();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (activeGroup) fetchReminders();
  }, [activeGroup]);

  const fetchReminders = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reminders?groupId=${activeGroup._id}`);
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    const reminder = reminders.find((r) => r._id === id);
    if (!reminder) return;

    setReminders((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isSent: !r.isSent } : r))
    );

    try {
      await fetch(`/api/reminders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSent: !reminder.isSent }),
      });
    } catch (err) {
      console.error(err);
      fetchReminders();
    }
  };

  const handleDelete = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r._id !== id));
    try {
      await fetch(`/api/reminders/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchReminders();
    }
  };

  const handleAdd = async (data: {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "low" | "medium" | "high";
  }) => {
    if (!activeGroup) return;
    try {
      const remindAt = new Date(`${data.dueDate}T${data.dueTime}`).toISOString();
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup._id,
          title: data.title,
          description: data.description,
          remindAt,
        }),
      });
      if (res.ok) {
        fetchReminders();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reminders.filter((r) => {
    if (activeFilter === "Active") return !r.isSent;
    if (activeFilter === "Done") return r.isSent;
    return true;
  });

  const activeCount = reminders.filter((r) => !r.isSent).length;
  const doneCount = reminders.filter((r) => r.isSent).length;

  const formatRemindAt = (remindAt: string) => {
    const date = new Date(remindAt);
    return {
      dueDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dueTime: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (!activeGroup) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 gap-4" data-theme="night">
        <p className="text-4xl">🔔</p>
        <p className="text-white font-medium">No active group selected</p>
        <p className="text-base-content/50 text-sm">Select a group from the sidebar to view reminders</p>
      </div>
    );
  }

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
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔔</p>
          <p className="text-white font-medium">No reminders found</p>
          <p className="text-base-content/50 text-sm mt-1">Add a new reminder to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((reminder) => {
            const { dueDate, dueTime } = formatRemindAt(reminder.remindAt);
            return (
              <ReminderCard
                key={reminder._id}
                id={reminder._id}
                title={reminder.title}
                description={reminder.description}
                dueDate={dueDate}
                dueTime={dueTime}
                priority="medium"
                isDone={reminder.isSent}
                assignee={reminder.createdBy?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                assigneeColor="#CECBF6"
                assigneeTextColor="#3C3489"
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

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