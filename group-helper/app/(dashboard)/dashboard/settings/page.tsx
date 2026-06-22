"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/ui/Topbar";
import ProfileSettings from "@/components/settings/ProfileSettings";
import GroupSettings from "@/components/settings/GroupSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";

const tabs = [
  { id: "profile", label: "👤 Profile" },
  { id: "group", label: "👥 Group" },
  { id: "notifications", label: "🔔 Notifications" },
];

interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
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
        title="Settings"
        subtitle="Manage your account and group preferences"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-white border-purple-500"
                : "text-base-content/50 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl">
        {activeTab === "profile" && user && (
          <ProfileSettings
            name={user.name}
            email={user.email}
            avatarColor={user.avatarColor || "#CECBF6"}
          />
        )}
        {activeTab === "group" && <GroupSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
      </div>

    </div>
  );
}