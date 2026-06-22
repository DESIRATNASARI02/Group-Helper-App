import Image from "next/image";
import {
  LayoutDashboard, CheckSquare, Calendar,
  FileText, MessageCircle, Users, CalendarCheck, Clock,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CheckSquare,     label: "Tasks" },
  { icon: Calendar,        label: "Calendar" },
  { icon: FileText,        label: "Notes" },
  { icon: MessageCircle,   label: "Chat" },
  { icon: Users,           label: "Members" },
];

const chatMessages = [
  { name: "Sarah",   text: "Don't forget our study session tonight!", time: "10:30 AM",  color: "bg-orange-400" },
  { name: "Michael", text: "I've shared the notes for chapter 5.",    time: "Yesterday", color: "bg-blue-500"   },
  { name: "Rachel",  text: "Can someone explain question 3?",         time: "Yesterday", color: "bg-green-500"  },
];

export default function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 overflow-hidden">

      {/* Topbar */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <Image src="/group-helper-logo.png" alt="Group Helper" width={22} height={22} />
        <span className="text-xs font-bold">
          <span className="text-blue-600">group</span>
          <span className="text-green-600">-helper</span>
        </span>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-[130px_1fr]">

        {/* Sidebar */}
        <aside className="border-r border-slate-100 bg-slate-50 py-3">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-600 font-semibold border-r-2 border-blue-600"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="space-y-3 p-4 bg-white">

          <div>
            <h3 className="text-sm font-bold text-slate-800">Welcome back, Alex 👋</h3>
            <p className="text-xs text-slate-400">Here's what's happening with your group today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Tasks</span>
                <CheckSquare size={12} className="text-blue-500" />
              </div>
              <div className="text-xl font-bold text-blue-600">12</div>
              <div className="text-[10px] text-slate-300">3 due today</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Sessions</span>
                <Calendar size={12} className="text-green-500" />
              </div>
              <div className="text-xl font-bold text-green-600">5</div>
              <div className="text-[10px] text-slate-300">2 this week</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Notes</span>
                <FileText size={12} className="text-violet-500" />
              </div>
              <div className="text-xl font-bold text-violet-600">18</div>
              <div className="text-[10px] text-slate-300">Shared notes</div>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-2 gap-2">

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10px] text-slate-400 mb-1">Upcoming Session</p>
              <p className="text-xs font-bold text-slate-700 mb-2">Database Study</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                <CalendarCheck size={10} /> May 24, 2025
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                <Clock size={10} /> 19:00 – 21:00
              </div>
              <button className="w-full rounded-lg bg-blue-600 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-700 transition-colors">
                Join Session
              </button>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-700">Recent Chat</p>
                <span className="text-[10px] text-blue-500 cursor-pointer">View all</span>
              </div>
              <div className="space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.name} className="flex items-start gap-1.5">
                    <div className={`${msg.color} w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[7px] font-bold text-white mt-0.5`}>
                      {msg.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-600">{msg.name}</span>
                        <span className="text-[9px] text-slate-300">{msg.time}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 truncate">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}