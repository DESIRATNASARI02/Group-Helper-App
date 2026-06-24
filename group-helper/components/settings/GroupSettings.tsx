"use client";

import { useState } from "react";
import { useGroup } from "@/lib/context/GroupContext";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

const predefinedTopics = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "MongoDB", "UI/UX", "DevOps", "Komputer & Jaringan", "Teknologi Umum",
  "Matematika", "Sains & Fisika", "Kimia & Biologi", "Sejarah & Sosial",
  "Ekonomi & Bisnis", "Hukum", "Kesehatan & Medis", "Bahasa & Linguistik",
  "Seni & Desain", "Musik", "Olahraga", "Transportasi", "Lingkungan & Alam",
]; 

export default function GroupSettings() {
  const { activeGroup, resetActiveGroup } = useGroup();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({
    name: activeGroup?.name || "",
    topic: activeGroup?.topic || "",
    description: activeGroup?.description || "",
  });

  const isOther = form.topic !== "" && !predefinedTopics.includes(form.topic); 

  const handleSave = async () => {
    if (!activeGroup) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${activeGroup._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!activeGroup) return;
    try {
      const res = await fetch(`/api/groups/${activeGroup._id}/leave`, {
        method: "POST",
      });
      if (res.ok) {
        setShowLeaveModal(false);
        resetActiveGroup();
        setTimeout(() => router.push("/groups"), 100);
      } else {
        const data = await res.json();
        setShowLeaveModal(false);
        setErrorModal(data.message || "Failed to leave group.");
      }
    } catch (err) {
      console.error(err);
      setErrorModal("Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!activeGroup) return;
    try {
      const res = await fetch(`/api/groups/${activeGroup._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowDeleteModal(false);
        resetActiveGroup();
        setTimeout(() => router.push("/groups"), 100);
      } else {
        const data = await res.json();
        setShowDeleteModal(false);
        setErrorModal(data.message || "Only the group admin can delete this group.");
      }
    } catch (err) {
      console.error(err);
      setErrorModal("Something went wrong.");
    }
  };

  if (!activeGroup) {
    return (
      <div className="text-center py-10">
        <p className="text-base-content/40">No active group selected</p>
      </div>
    );
  }

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
            value={isOther ? "Other" : form.topic} 
            onChange={(e) => {
              if (e.target.value === "Other") {
                setForm({ ...form, topic: "" });
              } else {
                setForm({ ...form, topic: e.target.value });
              }
            }}
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
            <optgroup label="📚 Akademik">
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

          
          {(isOther || form.topic === "") && (
            <input
              type="text"
              placeholder="Tulis topic kamu..."
              className="input input-bordered w-full mt-2"
              value={isOther ? form.topic : ""}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          )}
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

        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="alert alert-success text-sm">
            <span>✅ Group settings updated!</span>
          </div>
        )}

        <button
          onClick={handleSave}
          className={`btn text-white font-medium w-fit ${loading ? "loading" : ""}`}
          style={{ background: "#6C63FF" }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="max-w-md">
        <div
          className="rounded-xl p-4 border border-error/30"
          style={{ background: "#2a1a1a" }}
        >
          <h3 className="text-error font-medium text-sm mb-1">Danger Zone</h3>
          <p className="text-base-content/50 text-xs mb-3">
            Once you leave or delete this group, there is no going back.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="btn btn-sm btn-outline btn-error"
            >
              Leave Group
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-sm btn-error text-white"
            >
              Delete Group
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={!!errorModal}
        onClose={() => setErrorModal("")}
        title="⚠️ Warning"
      >
        <p className="text-base-content/70 text-sm">{errorModal}</p>
        <div className="flex justify-end mt-4">
          <button
            className="btn btn-sm text-white"
            style={{ background: "#6C63FF" }}
            onClick={() => setErrorModal("")}
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Leave Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Group"
      >
        <p className="text-base-content/70 text-sm">
          Are you sure you want to leave <span className="text-white font-medium">{activeGroup.name}</span>?
          You can rejoin later from Discover Groups.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="btn btn-outline flex-1" onClick={() => setShowLeaveModal(false)}>
            Cancel
          </button>
          <button className="btn btn-error flex-1 text-white" onClick={handleLeave}>
            Leave Group
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Group"
      >
        <p className="text-base-content/70 text-sm">
          Are you sure you want to delete <span className="text-white font-medium">{activeGroup.name}</span>?
          This action <span className="text-error font-medium">cannot be undone</span>.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="btn btn-outline flex-1" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button className="btn btn-error flex-1 text-white" onClick={handleDelete}>
            Delete Group
          </button>
        </div>
      </Modal>

    </div>
  );
}