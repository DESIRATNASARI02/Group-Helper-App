"use client";

import { useState } from "react";

export default function GroupSettings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Hacktiv8 Phase 3",
    topic: "Next.js",
    description: "Final project group for Hacktiv8 Phase 3 FSJS",
  });

  const topics = ["MongoDB", "Next.js", "React", "TypeScript", "Node.js", "JavaScript", "Python", "Other"];

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-white font-semibold text-lg">Group Settings</h2>
        <p className="text-base-content/50 text-sm mt-1">Manage your study group details</p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Group Name</span>
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
            <span className="label-text text-white">Topic</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          >
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full resize-none h-24"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {saved && (
          <div className="alert alert-success text-sm">
            <span>✅ Group settings updated!</span>
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

      {/* Danger Zone */}
      <div className="mt-4 max-w-md">
        <div
          className="rounded-xl p-4 border border-error/30"
          style={{ background: "#2a1a1a" }}
        >
          <h3 className="text-error font-medium text-sm mb-1">Danger Zone</h3>
          <p className="text-base-content/50 text-xs mb-3">
            Once you leave or delete this group, there is no going back.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline btn-error">
              Leave Group
            </button>
            <button className="btn btn-sm btn-error text-white">
              Delete Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}