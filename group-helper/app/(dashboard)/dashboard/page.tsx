"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/ui/Topbar";
import StatsSection from "@/components/dashboard/StatsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import ScheduleSection from "@/components/dashboard/ScheduleSection";
import ChatSection from "@/components/dashboard/ChatSection";
import NotesSection from "@/components/dashboard/NotesSection";
import MembersSection from "@/components/dashboard/MembersSection";
import { useGroup } from "@/lib/context/GroupContext";

interface Task {
  _id: string;
  title: string;
  status: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  createdBy: { name: string };
  updatedAt: string;
}

interface Schedule {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  members: string;
  type: string;
}

interface Message {
  _id: string;
  content: string;
  senderId: { _id: string; name: string };
  createdAt: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

export default function DashboardPage() {
  const { activeGroup, user } = useGroup(); 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeGroup) return;
    fetchAllData();
  }, [activeGroup]);

  const fetchAllData = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const [tasksRes, notesRes, schedulesRes, messagesRes, membersRes] = await Promise.all([
        fetch(`/api/tasks?groupId=${activeGroup._id}`),
        fetch(`/api/notes?groupId=${activeGroup._id}`),
        fetch(`/api/schedules?groupId=${activeGroup._id}`),
        fetch(`/api/messages?groupId=${activeGroup._id}`),
        fetch(`/api/groups/${activeGroup._id}/members`),
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (notesRes.ok) setNotes(await notesRes.json());
      if (schedulesRes.ok) setSchedules(await schedulesRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const getNextSession = () => {
    if (schedules.length === 0) return null;
    const todayStr = new Date().toISOString().split("T")[0];
    const upcoming = schedules
      .filter((s) => s.date >= todayStr)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
    return upcoming[0] || null;
  };

  if (!activeGroup) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 gap-4" data-theme="night">
        <p className="text-4xl">👥</p>
        <p className="text-white font-medium">No active group selected</p>
        <p className="text-base-content/50 text-sm">Select a group from the sidebar</p>
        <Link href="/groups">
          <button className="btn btn-sm text-white" style={{ background: "#6C63FF" }}>
            Go to Groups
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Dashboard"
        subtitle={`${activeGroup.name} · ${user ? `Welcome back, ${user.name}!` : "Loading..."}`}
        actions={
          <Link href="/dashboard/tasks">
            <button className="btn btn-sm text-white font-medium" style={{ background: "#6C63FF" }}>
              + New Task
            </button>
          </Link>
        }
      />

      <StatsSection
        totalTasks={tasks.length}
        completedTasks={completedTasks}
        totalMembers={members.length}
        totalNotes={notes.length}
        nextSession={getNextSession()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TasksSection tasks={tasks} loading={loading} />
        <ScheduleSection schedules={schedules} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChatSection
          messages={messages}
          loading={loading}
          currentUserId={user?._id || ""}
        />
        <NotesSection notes={notes} loading={loading} />
        <MembersSection members={members} loading={loading} />
      </div>

    </div>
  );
}