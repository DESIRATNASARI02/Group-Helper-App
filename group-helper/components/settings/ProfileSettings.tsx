"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";

interface ProfileSettingsProps {
  name: string;
  email: string;
  avatarColor: string;
}

const avatarColors = [
  { bg: "#CECBF6", text: "#3C3489" },
  { bg: "#9FE1CB", text: "#085041" },
  { bg: "#F5C4B3", text: "#712B13" },
  { bg: "#FAC775", text: "#633806" },
  { bg: "#B5D4F4", text: "#0C447C" },
  { bg: "#C0DD97", text: "#27500A" },
];

export default function ProfileSettings({ name, email, avatarColor }: ProfileSettingsProps) {
  const [form, setForm] = useState({ name, email, avatarColor });
  const [saved, setSaved] = useState(false);

  const getInitials = (n: string) =>
    n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = async () => {
    // nanti connect ke /api/auth/update
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-white font-semibold text-lg">Profile</h2>
        <p className="text-base-content/50 text-sm mt-1">Update your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar
          initials={getInitials(form.name)}
          color={form.avatarColor}
          textColor={avatarColors.find((c) => c.bg === form.avatarColor)?.text || "#3C3489"}
          size="lg"
        />
        <div>
          <p className="text-white text-sm font-medium mb-2">Avatar Color</p>
          <div className="flex gap-2">
            {avatarColors.map((c, i) => (
              <button
                key={i}
                onClick={() => setForm({ ...form, avatarColor: c.bg })}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c.bg,
                  outline: form.avatarColor === c.bg ? "2px solid white" : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 max-w-md">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Full Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">New Password</span>
            <span className="label-text-alt text-base-content/40">Optional</span>
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            className="input input-bordered w-full"
          />
        </div>

        {saved && (
          <div className="alert alert-success text-sm">
            <span>✅ Profile updated successfully!</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="btn text-white font-medium w-fit"
          style={{ background: "#6C63FF" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}