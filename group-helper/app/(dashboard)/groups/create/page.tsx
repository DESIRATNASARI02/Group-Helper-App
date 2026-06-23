"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const topics = [
  // Teknologi & Pemrograman
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "UI/UX",
  "DevOps",
  // General
  "Bahasa & Linguistik",
  "Matematika",
  "Sains & Fisika",
  "Kimia & Biologi",
  "Sejarah & Sosial",
  "Ekonomi & Bisnis",
  "Hukum",
  "Kesehatan & Medis",
  "Seni & Desain",
  "Musik",
  "Olahraga",
  "Transportasi",
  "Lingkungan & Alam",
  "Teknologi Umum",
  "Komputer & Jaringan",
  // Other
  "Other",
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    topic: "",
    customTopic: "", 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = form.topic === "Other"; 
  const finalTopic = isOther ? form.customTopic : form.topic;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !finalTopic) {
      setError("Group name and topic are required!");
      return;
    }

    if (isOther && !form.customTopic.trim()) { 
      setError("Please enter a custom topic!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          topic: finalTopic, 
        }),
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

              <optgroup label="💻 Teknologi & Pemrograman">
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="Node.js">Node.js</option>
                <option value="MongoDB">MongoDB</option>
                <option value="UI/UX">UI/UX</option>
                <option value="DevOps">DevOps</option>
                <option value="Komputer & Jaringan">Komputer & Jaringan</option>
                <option value="Teknologi Umum">Teknologi Umum</option>
              </optgroup>

              <optgroup label="📚 Akademik"> {/* <== */}
                <option value="Matematika">Matematika</option>
                <option value="Sains & Fisika">Sains & Fisika</option>
                <option value="Kimia & Biologi">Kimia & Biologi</option>
                <option value="Sejarah & Sosial">Sejarah & Sosial</option>
                <option value="Ekonomi & Bisnis">Ekonomi & Bisnis</option>
                <option value="Hukum">Hukum</option>
                <option value="Kesehatan & Medis">Kesehatan & Medis</option>
                <option value="Bahasa & Linguistik">Bahasa & Linguistik</option>
              </optgroup>

              <optgroup label="🎨 Kreatif & Lainnya"> 
                <option value="Seni & Desain">Seni & Desain</option>
                <option value="Musik">Musik</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Lingkungan & Alam">Lingkungan & Alam</option>
              </optgroup>

              <optgroup label="➕ Lainnya">
                <option value="Other">Other (Custom)</option>
              </optgroup>
            </select>

            
            {isOther && ( 
              <input
                type="text"
                name="customTopic"
                placeholder="Tulis topic kamu... (e.g. Belajar Bahasa Inggris)"
                className="input input-bordered w-full mt-2"
                value={form.customTopic}
                onChange={handleChange}
                autoFocus
              />
            )}
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
                  style={{ background: finalTopic ? "#6C63FF" : "#888" }}
                >
                  {finalTopic || "No topic"}
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