"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/groups", icon: "👥", label: "My Groups" },
  { href: "/dashboard/tasks", icon: "✅", label: "Tasks" },
  { href: "/dashboard/notes", icon: "📝", label: "Notes" },
  { href: "/dashboard/schedule", icon: "📅", label: "Schedule" },
  { href: "/dashboard/chat", icon: "💬", label: "Chat" },
  { href: "/dashboard/reminders", icon: "🔔", label: "Reminders" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className="w-56 min-h-screen flex flex-col border-r border-base-300"
      style={{ background: "#1a1a2e" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-base-300">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white">
          <Image
            src="/group-helper-logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="font-bold text-white text-sm">Group Helper</span>
      </div>

      {/* Group Selector */}
      <div className="p-3 border-b border-base-300">
        <p className="text-xs text-base-content/40 uppercase tracking-wider mb-2">
          My Groups
        </p>
        <Link href="/groups">
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: "rgba(108,99,255,0.2)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#6C63FF" }}></div>
            <span className="text-sm text-white">Select Group</span>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? "text-white font-medium"
                  : "text-base-content/60 hover:text-white hover:bg-white/5"
              }`}
              style={isActive ? { background: "rgba(108,99,255,0.3)" } : {}}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-base-300">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold .flex-shrink-0"
            style={{
              background: user?.avatarColor || "#CECBF6",
              color: "#3C3489",
            }}
          >
            {user ? getInitials(user.name) : ".."}
          </div>
          <div>
            <p className="text-xs font-medium text-white">
              {user ? user.name : "Loading..."}
            </p>
            <p className="text-xs text-base-content/40">Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}