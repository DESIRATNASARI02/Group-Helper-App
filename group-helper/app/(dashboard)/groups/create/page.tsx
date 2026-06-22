"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const topics = [
  "MongoDB",
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "JavaScript",
  "Python",
  "UI/UX",
  "DevOps",
  "Other",
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    topic: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.topic) {
      setError("Group name and topic are required!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/dashboard");

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" data-theme="night">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Group</h1>
          <p className="text-base-content/50 mt-1">
            Set up your study group and invite others to join
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-4 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Group Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-white">Group Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. MongoDB Study Group"
              className="input input-bordered w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Topic */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-white">Topic</span>
            </label>
            <select
              name="topic"
              className="select select-bordered w-full"
              value={form.topic}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a topic...</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-white">Description</span>
              <span className="label-text-alt text-base-content/40">Optional</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe what your group will study..."
              className="textarea textarea-bordered w-full h-28 resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Preview */}
          {form.name && (
            <div
              className="rounded-xl p-4 border border-white/10"
              style={{ background: "#1e1e3a" }}
            >
              <p className="text-xs text-base-content/40 mb-2">Preview</p>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="badge badge-sm text-white"
                  style={{ background: form.topic ? "#6C63FF" : "#888" }}
                >
                  {form.topic || "No topic"}
                </span>
                <span className="text-xs text-base-content/40">👥 1 member</span>
              </div>
              <p className="text-white font-bold">{form.name}</p>
              <p className="text-base-content/50 text-sm mt-1">
                {form.description || "No description provided"}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="btn btn-outline flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn flex-1 text-white font-bold ${loading ? "loading" : ""}`}
              style={{ background: "#6C63FF" }}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}