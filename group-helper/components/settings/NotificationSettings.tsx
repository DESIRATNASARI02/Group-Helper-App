"use client";

import { useState } from "react";

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialSettings: NotifSetting[] = [
  {
    id: "reminder",
    label: "Reminder Notifications",
    description: "Get notified when a reminder is due",
    enabled: true,
  },
  {
    id: "chat",
    label: "Chat Messages",
    description: "Get notified when someone sends a message",
    enabled: true,
  },
  {
    id: "task",
    label: "Task Updates",
    description: "Get notified when a task is assigned or updated",
    enabled: false,
  },
  {
    id: "schedule",
    label: "Session Reminders",
    description: "Get notified 30 minutes before a study session",
    enabled: true,
  },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotifSetting[]>(initialSettings);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-white font-semibold text-lg">Notifications</h2>
        <p className="text-base-content/50 text-sm mt-1">Manage your notification preferences</p>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        {settings.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-4 rounded-xl border border-white/10"
            style={{ background: "#1e1e3a" }}
          >
            <div>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-base-content/50 text-xs mt-0.5">{s.description}</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={s.enabled}
              onChange={() => handleToggle(s.id)}
              style={{ accentColor: "#6C63FF" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}