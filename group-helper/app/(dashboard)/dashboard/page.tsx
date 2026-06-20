"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

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

  const stats = [
    { label: "Total task", value: "24", hint: "8 selesai hari ini", hintColor: "text-success" },
    { label: "Anggota", value: "6", hint: "Semua aktif", hintColor: "text-success" },
    { label: "Notes", value: "12", hint: "3 diupdate hari ini", hintColor: "text-base-content/50" },
    { label: "Sesi berikutnya", value: "20:00", hint: "Malam ini", hintColor: "text-error" },
  ];

  const tasks = [
    { title: "Setup Next.js project", status: "done", assignee: "DR", due: "14 Jun" },
    { title: "Implement JWT auth", status: "progress", assignee: "DR", due: "17 Jun" },
    { title: "Deploy ke Vercel", status: "todo", assignee: "FK", due: "18 Jun" },
    { title: "GC02 final submission", status: "urgent", assignee: "DR", due: "18 Jun" },
  ];

  const schedules = [
    { time: "09:00", title: "Next.js App Router", members: "Semua anggota", color: "#6C63FF" },
    { time: "14:00", title: "MongoDB review", members: "Desi, Firhan", color: "#1D9E75" },
    { time: "20:00", title: "Live code prep", members: "Semua anggota", color: "#D85A30" },
  ];

  const chats = [
    { name: "Firhan", avatar: "FK", color: "#9FE1CB", textColor: "#085041", message: "Udah push branch feat/auth belum?" },
    { name: "Kamu", avatar: "DR", color: "#CECBF6", textColor: "#3C3489", message: "Udah, cek PR nya ya 🙏", isMe: true },
    { name: "Bot", avatar: "🤖", color: "#6C63FF", textColor: "white", message: "Reminder: GC02 deadline besok 18:00 WIB!" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done": return <span className="badge badge-sm text-white" style={{background:"#1D9E75"}}>Done</span>;
      case "progress": return <span className="badge badge-sm text-white" style={{background:"#EF9F27"}}>Progress</span>;
      case "todo": return <span className="badge badge-sm" style={{background:"#EEEDFE",color:"#534AB7"}}>Todo</span>;
      case "urgent": return <span className="badge badge-sm text-white" style={{background:"#E24B4A"}}>Urgent</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-base-content/50 text-sm mt-0.5">
            Hacktiv8 Phase 3 · {user ? `Halo, ${user.name}!` : "Loading..."}
          </p>
        </div>
        <button
          className="btn btn-sm text-white font-medium"
          style={{ background: "#6C63FF" }}
        >
          + Buat task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
            <p className="text-xs text-base-content/50 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className={`text-xs mt-1 ${s.hintColor}`}>{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Tasks + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Tasks */}
        <div className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">✅ Shared tasks</h2>
            <span className="text-xs cursor-pointer" style={{ color: "#6C63FF" }}>Lihat semua</span>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                    task.status === "done"
                      ? "border-none"
                      : "border-white/20"
                  }`}
                  style={task.status === "done" ? { background: "#1D9E75" } : {}}
                >
                  {task.status === "done" && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-base-content/40" : "text-white"}`}>
                  {task.title}
                </span>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">📅 Jadwal hari ini</h2>
            <span className="text-xs cursor-pointer" style={{ color: "#6C63FF" }}>Kalender</span>
          </div>
          <div className="flex flex-col gap-3">
            {schedules.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-base-content/40 w-10">{s.time}</span>
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: s.color }}></div>
                <div>
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="text-xs text-base-content/50">{s.members}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Chat */}
        <div className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">💬 Chat terbaru</h2>
            <span className="text-xs cursor-pointer" style={{ color: "#6C63FF" }}>Buka chat</span>
          </div>
          <div className="flex flex-col gap-3">
            {chats.map((c, i) => (
              <div key={i} className={`flex gap-2 items-start ${c.isMe ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: c.color, color: c.textColor }}
                >
                  {c.avatar}
                </div>
                <div className={`max-w-xs ${c.isMe ? "items-end" : "items-start"} flex flex-col`}>
                  <p className="text-xs text-base-content/40 mb-1">{c.name}</p>
                  <div
                    className="text-xs px-3 py-2 rounded-lg text-white"
                    style={{ background: c.isMe ? "#6C63FF" : "#2a2a4a" }}
                  >
                    {c.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl p-4" style={{ background: "#1e1e3a" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm">📝 Shared notes</h2>
            <span className="text-xs cursor-pointer" style={{ color: "#6C63FF" }}>Semua notes</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-lg p-3" style={{ background: "#FAEEDA20", borderLeft: "3px solid #EF9F27" }}>
              <p className="text-sm font-medium text-white">SSR vs CSR di Next.js</p>
              <p className="text-xs text-base-content/50 mt-1">Server components render on server...</p>
              <p className="text-xs text-base-content/30 mt-2">Desi · 2j lalu</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#E1F5EE20", borderLeft: "3px solid #1D9E75" }}>
              <p className="text-sm font-medium text-white">MongoDB Atlas setup</p>
              <p className="text-xs text-base-content/50 mt-1">Connection string format...</p>
              <p className="text-xs text-base-content/30 mt-2">Firhan · 5j lalu</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}