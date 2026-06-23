"use client";

import { useState } from "react";
import Topbar from "@/components/ui/Topbar";
import ProfileSettings from "@/components/settings/ProfileSettings";
import GroupSettings from "@/components/settings/GroupSettings";
import { useGroup } from "@/lib/context/GroupContext";

const tabs = [
  { id: "profile", label: "👤 Profile" },
  { id: "group", label: "👥 Group" },
];

export default function SettingsPage() {
  const { user, setUser } = useGroup(); 
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileSave = (updated: { name: string; email: string; avatarColor: string }) => {
    if (user) setUser({ ...user, ...updated }); 
  };

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Settings"
        subtitle="Manage your account and group preferences"
      />

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

      <div className="max-w-2xl">
        {activeTab === "profile" && user && (
          <ProfileSettings
            name={user.name}
            email={user.email}
            avatarColor={user.avatarColor || "#CECBF6"}
            onSave={handleProfileSave} 
          />
        )}
        {activeTab === "group" && <GroupSettings />}
      </div>

    </div>
  );
}