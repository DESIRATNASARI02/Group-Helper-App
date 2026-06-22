"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { useGroup } from "@/lib/context/GroupContext";
import Link from "next/link";

interface Reminder {
  _id: string;
  title: string;
  remindAt: string;
  isSent: boolean;
}

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  const { activeGroup } = useGroup();
  const [showNotif, setShowNotif] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeGroup) return;
    fetchReminders();
  }, [activeGroup]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchReminders = async () => {
    if (!activeGroup) return;
    try {
      const res = await fetch(`/api/reminders?groupId=${activeGroup._id}`);
      if (res.ok) {
        const data = await res.json();
        setReminders(data.filter((r: Reminder) => !r.isSent));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatRemindAt = (remindAt: string) => {
    const d = new Date(remindAt);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " · " +
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const unreadCount = reminders.length;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-base-content/50 text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-white relative"
          >
            🔔
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ background: "#E24B4A" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className="absolute right-0 top-10 w-72 rounded-xl border border-white/10 z-50 overflow-hidden"
              style={{ background: "#1e1e3a" }}
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <p className="text-white text-sm font-medium">Notifications</p>
                <span className="badge badge-sm text-white" style={{ background: "#6C63FF" }}>
                  {unreadCount} active
                </span>
              </div>

              {reminders.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-2xl mb-2">🔔</p>
                  <p className="text-base-content/40 text-sm">No active reminders</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {reminders.map((r) => (
                    <div
                      key={r._id}
                      className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm mt-0.5">🔔</span>
                        <div>
                          <p className="text-white text-sm font-medium">{r.title}</p>
                          <p className="text-base-content/40 text-xs mt-0.5">
                            {formatRemindAt(r.remindAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-4 py-2 border-t border-white/10 text-center">
                <Link
                  href="/dashboard/reminders"
                  className="text-xs hover:underline"
                  style={{ color: "#6C63FF" }}
                  onClick={() => setShowNotif(false)}
                >
                  View all reminders
                </Link>
              </div>
            </div>
          )}
        </div>

        {actions}
      </div>
    </div>
  );
}