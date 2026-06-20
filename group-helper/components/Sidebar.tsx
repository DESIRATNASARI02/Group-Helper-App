"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/tasks", icon: "✅", label: "Tasks" },
  { href: "/dashboard/notes", icon: "📝", label: "Notes" },
  { href: "/dashboard/schedule", icon: "📅", label: "Schedule" },
  { href: "/dashboard/chat", icon: "💬", label: "Chat" },
  { href: "/dashboard/reminders", icon: "🔔", label: "Reminders" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
          Grup saya
        </p>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "rgba(108,99,255,0.2)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "#6C63FF" }}></div>
          <span className="text-sm text-white">Hacktiv8 Phase 3</span>
        </div>
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
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "#CECBF6", color: "#3C3489" }}
          >
            DR
          </div>
          <div>
            <p className="text-xs font-medium text-white">Desi Ratna</p>
            <p className="text-xs text-base-content/40">Captain</p>
          </div>
        </div>
      </div>
    </aside>
  );
}