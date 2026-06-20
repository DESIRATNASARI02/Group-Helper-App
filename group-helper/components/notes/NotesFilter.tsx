"use client";

interface NotesFilterProps {
  tags: string[];
  activeTag: string;
  search: string;
  onTagChange: (tag: string) => void;
  onSearchChange: (val: string) => void;
  onNewNote: () => void;
}

export default function NotesFilter({
  tags,
  activeTag,
  search,
  onTagChange,
  onSearchChange,
  onNewNote,
}: NotesFilterProps) {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Shared Notes</h2>
          <button
            onClick={onNewNote}
            className="btn btn-xs text-white"
            style={{ background: "#6C63FF" }}
          >
            + New
          </button>
        </div>
        <input
          type="text"
          placeholder="Search notes..."
          className="input input-bordered input-sm w-full"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="px-3 py-2 border-b border-white/10 flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`badge badge-sm cursor-pointer transition-all ${
              activeTag === tag ? "text-white" : "text-base-content/50"
            }`}
            style={activeTag === tag ? { background: "#6C63FF" } : { background: "#2a2a4a" }}
          >
            {tag}
          </button>
        ))}
      </div>
    </>
  );
}