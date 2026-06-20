"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/ui/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

const stats = [
  { label: "Total Tasks", value: "24", hint: "8 completed today", hintColor: "text-success", icon: "✅" },
  { label: "Members", value: "6", hint: "All active", hintColor: "text-success", icon: "👥" },
  { label: "Notes", value: "12", hint: "3 updated today", hintColor: "text-base-content/50", icon: "📝" },
  { label: "Next Session", value: "20:00", hint: "Tonight", hintColor: "text-error", icon: "📅" },
];

const tasks = [
  { title: "Setup Next.js project", status: "done", due: "Jun 14", assignee: "DR", assigneeColor: "#CECBF6", assigneeTextColor: "#3C3489" },
  { title: "Implement JWT auth", status: "progress", due: "Jun 17", assignee: "DR", assigneeColor: "#CECBF6", assigneeTextColor: "#3C3489" },
  { title: "Deploy to Vercel", status: "todo", due: "Jun 18", assignee: "FK", assigneeColor: "#9FE1CB", assigneeTextColor: "#085041" },
  { title: "GC02 final submission", status: "urgent", due: "Jun 18", assignee: "DR", assigneeColor: "#CECBF6", assigneeTextColor: "#3C3489" },
];

const schedules = [
  { time: "09:00", title: "Next.js App Router", members: "All members", color: "#6C63FF" },
  { time: "14:00", title: "MongoDB review", members: "Desi, Firhan", color: "#1D9E75" },
  { time: "20:00", title: "Live code prep", members: "All members", color: "#D85A30" },
];

const chats = [
  { name: "Firhan", initials: "FK", color: "#9FE1CB", textColor: "#085041", message: "Have you pushed the auth branch yet?", isMe: false },
  { name: "You", initials: "DR", color: "#CECBF6", textColor: "#3C3489", message: "Yes, check the PR 🙏", isMe: true },
  { name: "Bot", initials: "🤖", color: "#6C63FF", textColor: "white", message: "Reminder: GC02 deadline tomorrow 18:00!", isMe: false },
];

const notes = [
  { title: "SSR vs CSR in Next.js", preview: "Server components render on server...", author: "Desi", time: "2h ago", color: "#EF9F27" },
  { title: "MongoDB Atlas setup", preview: "Connection string format...", author: "Firhan", time: "5h ago", color: "#1D9E75" },
];

const members = [
  { name: "Desi Ratna", initials: "DR", color: "#CECBF6", textColor: "#3C3489", role: "Captain", online: true },
  { name: "Firhan Kafi", initials: "FK", color: "#9FE1CB", textColor: "#085041", role: "Member", online: true },
  { name: "Aziz", initials: "AZ", color: "#F5C4B3", textColor: "#712B13", role: "Member", online: true },
  { name: "Rahma", initials: "RA", color: "#FAC775", textColor: "#633806", role: "Member", online: false },
];

const statusBadgeConfig: Record<string, { label: string; color: string; bg: string }> = {
  done: { label: "Done", color: "white", bg: "#1D9E75" },
  progress: { label: "In Progress", color: "white", bg: "#EF9F27" },
  todo: { label: "Todo", color: "#534AB7", bg: "#EEEDFE" },
  urgent: { label: "Urgent", color: "white", bg: "#E24B4A" },
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Dashboard"
        subtitle={`Hacktiv8 Phase 3 · ${user ? `Welcome back, ${user.name}!` : "Loading..."}`}
        actions={
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-sm btn-circle text-base-content/50">🔔</button>
            <button className="btn btn-sm text-white font-medium" style={{ background: "#6C63FF" }}>
              + New Task
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <p className="text-xs text-base-content/50 mb-1 flex items-center gap-1">
              <span>{s.icon}</span> {s.label}
            </p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className={`text-xs mt-1 ${s.hintColor}`}>{s.hint}</p>
          </Card>
        ))}
      </div>

      {/* Tasks + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">✅ Shared Tasks</h2>
            <Link href="/dashboard/tasks">
              <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>See all</span>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task, i) => {
              const badge = statusBadgeConfig[task.status];
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border"
                    style={task.status === "done"
                      ? { background: "#1D9E75", borderColor: "#1D9E75" }
                      : { borderColor: "rgba(255,255,255,0.2)" }
                    }
                  >
                    {task.status === "done" && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-base-content/40" : "text-white"}`}>
                    {task.title}
                  </span>
                  <Badge label={badge.label} color={badge.color} bg={badge.bg} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">📅 Today's Schedule</h2>
            <Link href="/dashboard/schedule">
              <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>Calendar</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {schedules.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-base-content/40 w-10">{s.time}</span>
                <div className="w-1 h-10 rounded-full .flex-shrink-0" style={{ background: s.color }}></div>
                <div>
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="text-xs text-base-content/50">{s.members}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chat + Notes + Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">💬 Recent Chat</h2>
            <Link href="/dashboard/chat">
              <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>Open chat</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {chats.map((c, i) => (
              <div key={i} className={`flex gap-2 items-start ${c.isMe ? "flex-row-reverse" : ""}`}>
                <Avatar initials={c.initials} color={c.color} textColor={c.textColor} size="sm" />
                <div className={`flex flex-col ${c.isMe ? "items-end" : "items-start"}`}>
                  <p className="text-xs text-base-content/40 mb-1">{c.name}</p>
                  <div
                    className="text-xs px-3 py-2 rounded-lg text-white max-w-xs"
                    style={{ background: c.isMe ? "#6C63FF" : "#2a2a4a" }}
                  >
                    {c.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">📝 Shared Notes</h2>
            <Link href="/dashboard/notes">
              <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>All notes</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {notes.map((n, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{ background: `${n.color}15`, borderLeft: `3px solid ${n.color}` }}
              >
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="text-xs text-base-content/50 mt-1">{n.preview}</p>
                <p className="text-xs text-base-content/30 mt-2">{n.author} · {n.time}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">👥 Members</h2>
          </div>
          <div className="flex flex-col gap-3">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar initials={m.initials} color={m.color} textColor={m.textColor} size="md" />
                  <div
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-100"
                    style={{ background: m.online ? "#1D9E75" : "#888" }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-base-content/40">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}