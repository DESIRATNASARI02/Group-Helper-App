"use client";

import { useState } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import WeeklyCalendar from "@/components/schedule/WeeklyCalendar";

interface Schedule {
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

const initialSchedules: Schedule[] = [
  {
    id: "1",
    title: "Next.js App Router Deep Dive",
    description: "Cover server components, client components, and data fetching",
    date: "Jun 23, 2026",
    startTime: "09:00",
    endTime: "11:00",
    type: "study",
    members: "All members",
    color: "#6C63FF",
  },
  {
    id: "2",
    title: "MongoDB Aggregation Review",
    description: "Practice aggregation pipeline with real examples",
    date: "Jun 23, 2026",
    startTime: "14:00",
    endTime: "15:30",
    type: "review",
    members: "Desi, Firhan",
    color: "#1D9E75",
  },
  {
    id: "3",
    title: "Live Code Prep Session",
    description: "Simulate live code exam conditions",
    date: "Jun 24, 2026",
    startTime: "20:00",
    endTime: "22:00",
    type: "study",
    members: "All members",
    color: "#6C63FF",
  },
  {
    id: "4",
    title: "Phase 3 Live Code Exam",
    description: "Official Hacktiv8 Phase 3 assessment",
    date: "Jun 25, 2026",
    startTime: "09:00",
    endTime: "12:00",
    type: "exam",
    members: "All members",
    color: "#E24B4A",
  },
];

const days = ["Today", "Tomorrow", "This Week", "All"];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [activeDay, setActiveDay] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<"weekly" | "list">("weekly");

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAdd = (data: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    type: "study" | "review" | "exam" | "meeting";
    members: string;
  }) => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      ...data,
      color: typeColors[data.type],
    };
    setSchedules((prev) => [...prev, newSchedule]);
    setShowModal(false);
  };

  const typeCount = {
    study: schedules.filter((s) => s.type === "study").length,
    review: schedules.filter((s) => s.type === "review").length,
    exam: schedules.filter((s) => s.type === "exam").length,
    meeting: schedules.filter((s) => s.type === "meeting").length,
  };

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Schedule"
        subtitle={`${schedules.length} sessions planned`}
        actions={
          <div className="flex items-center gap-3">
            {/* View Toggle */}
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

      {/* Weekly Calendar View */}
      {view === "weekly" && (
        <WeeklyCalendar schedules={schedules} />
      )}

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
            {schedules.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-white font-medium">No schedules yet</p>
                <p className="text-base-content/50 text-sm mt-1">Add a study session to get started</p>
              </div>
            ) : (
              schedules.map((schedule) => (
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

      {/* Modal */}
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