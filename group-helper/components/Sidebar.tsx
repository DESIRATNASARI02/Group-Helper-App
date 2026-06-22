"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useGroup } from "@/lib/context/GroupContext";

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

const topicColors: Record<string, string> = {
  "MongoDB": "#1D9E75",
  "Next.js": "#6C63FF",
  "React": "#61DAFB",
  "TypeScript": "#3178C6",
  "Node.js": "#68A063",
  "default": "#EF9F27",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeGroup, groups, setActiveGroup } = useGroup();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/login");
  };

  const groupColor = activeGroup
    ? topicColors[activeGroup.topic] || topicColors["default"]
    : "#6C63FF";

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
      <div className="p-3 border-b border-base-300 relative" ref={dropdownRef}>
        <p className="text-xs text-base-content/40 uppercase tracking-wider mb-2">
          Active Group
        </p>
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          style={{ background: "rgba(108,99,255,0.2)" }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: groupColor }}></div>
          <span className="text-sm text-white truncate flex-1">
            {activeGroup ? activeGroup.name : "Select Group"}
          </span>
          <span className="text-base-content/40 text-xs">{showDropdown ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            className="absolute left-3 right-3 top-full mt-1 rounded-xl border border-white/10 overflow-hidden z-50"
            style={{ background: "#1e1e3a" }}
          >
            {groups.length === 0 ? (
              <div className="p-3 text-center">
                <p className="text-xs text-base-content/40">No groups yet</p>
                <Link
                  href="/groups"
                  className="text-xs mt-1 block"
                  style={{ color: "#6C63FF" }}
                  onClick={() => setShowDropdown(false)}
                >
                  Join or create a group
                </Link>
              </div>
            ) : (
              <>
                {groups.map((group) => {
                  const color = topicColors[group.topic] || topicColors["default"];
                  const isActive = activeGroup?._id === group._id;
                  return (
                    <button
                      key={group._id}
                      onClick={() => {
                        setActiveGroup(group);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-all"
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
                      <span className={`text-sm truncate flex-1 ${isActive ? "text-white font-medium" : "text-base-content/60"}`}>
                        {group.name}
                      </span>
                      {isActive && <span className="text-xs" style={{ color: "#6C63FF" }}>✓</span>}
                    </button>
                  );
                })}
                <div className="border-t border-white/10">
                  <Link
                    href="/groups"
                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-all"
                    style={{ color: "#6C63FF" }}
                    onClick={() => setShowDropdown(false)}
                  >
                    + Manage Groups
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
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
            style={{
              background: user?.avatarColor || "#CECBF6",
              color: "#3C3489",
            }}
          >
            {user ? getInitials(user.name) : ".."}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white">
              {user ? user.name : "Loading..."}
            </p>
            <p className="text-xs text-base-content/40">Member</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-base-content/30 hover:text-error transition-colors text-sm"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}