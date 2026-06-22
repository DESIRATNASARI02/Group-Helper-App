"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import WeeklyCalendar from "@/components/schedule/WeeklyCalendar";
import { useGroup } from "@/lib/context/GroupContext";

interface Schedule {
  _id?: string;
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "study" | "review" | "exam" | "meeting";
  members: string;
  color: string;
}

const typeColors = {
  study: "#6C63FF",
  review: "#1D9E75",
  exam: "#E24B4A",
  meeting: "#EF9F27",
};

const days = ["Today", "Tomorrow", "This Week", "All"];

export default function SchedulePage() {
  const { activeGroup } = useGroup();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<"weekly" | "list">("weekly");

  useEffect(() => {
    if (activeGroup) fetchSchedules();
  }, [activeGroup]);

  const fetchSchedules = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/schedules?groupId=${activeGroup._id}`);
      if (res.ok) {
        const data = await res.json();
        const formatted: Schedule[] = data.map((s: any) => ({
          _id: s._id,
          id: s._id,
          title: s.title,
          description: s.description,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          type: s.type,
          members: s.members || "All members",
          color: typeColors[s.type as keyof typeof typeColors] || "#6C63FF",
        }));
        setSchedules(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule?._id) return;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/schedules/${schedule._id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      fetchSchedules();
    }
  };

  const handleAdd = async (data: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    type: "study" | "review" | "exam" | "meeting";
    members: string;
  }) => {
    if (!activeGroup) return;
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup._id,
          ...data,
        }),
      });
      if (res.ok) {
        await fetchSchedules();
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filterSchedules = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    switch (activeDay) {
      case "Today":
        return schedules.filter((s) => s.date === todayStr);
      case "Tomorrow":
        return schedules.filter((s) => s.date === tomorrowStr);
      case "This Week":
        return schedules.filter((s) => {
          const d = new Date(s.date + "T00:00:00");
          return d >= new Date(todayStr + "T00:00:00") && d <= weekEnd;
        });
      default:
        return schedules;
    }
  };

  const typeCount = {
    study: schedules.filter((s) => s.type === "study").length,
    review: schedules.filter((s) => s.type === "review").length,
    exam: schedules.filter((s) => s.type === "exam").length,
    meeting: schedules.filter((s) => s.type === "meeting").length,
  };

  if (!activeGroup) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 gap-4" data-theme="night">
        <p className="text-4xl">📅</p>
        <p className="text-white font-medium">No active group selected</p>
        <p className="text-base-content/50 text-sm">Select a group from the sidebar to view schedule</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Schedule"
        subtitle={`${activeGroup.name} · ${schedules.length} sessions planned`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("weekly")}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  view === "weekly" ? "text-white" : "text-base-content/50 hover:text-white"
                }`}
                style={view === "weekly" ? { background: "rgba(108,99,255,0.3)" } : {}}
              >
                📅 Weekly
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  view === "list" ? "text-white" : "text-base-content/50 hover:text-white"
                }`}
                style={view === "list" ? { background: "rgba(108,99,255,0.3)" } : {}}
              >
                📋 List
              </button>
            </div>
            <button
              className="btn btn-sm text-white font-medium"
              style={{ background: "#6C63FF" }}
              onClick={() => setShowModal(true)}
            >
              + Add Schedule
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Study", value: typeCount.study, color: "#6C63FF" },
          { label: "Review", value: typeCount.review, color: "#1D9E75" },
          { label: "Exam", value: typeCount.exam, color: "#E24B4A" },
          { label: "Meeting", value: typeCount.meeting, color: "#EF9F27" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
            <p className="text-xs text-base-content/50 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : (
        <>
          {/* Weekly Calendar View */}
          {view === "weekly" && <WeeklyCalendar schedules={schedules} />}

          {/* List View */}
          {view === "list" && (
            <>
              <div className="flex gap-2">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className={`btn btn-sm ${activeDay === d ? "text-white" : "btn-outline"}`}
                    style={activeDay === d ? { background: "#6C63FF", border: "none" } : {}}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {filterSchedules().length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-4xl mb-4">📅</p>
                    <p className="text-white font-medium">No schedules found</p>
                    <p className="text-base-content/50 text-sm mt-1">
                      {activeDay === "All" ? "Add a study session to get started" : `No sessions for ${activeDay.toLowerCase()}`}
                    </p>
                  </div>
                ) : (
                  filterSchedules().map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      {...schedule}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Schedule"
      >
        <ScheduleForm
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      </Modal>

    </div>
  );
}