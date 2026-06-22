import Link from "next/link";
import Card from "@/components/ui/Card";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdBy: { name: string };
  updatedAt: string;
}

interface NotesSectionProps {
  notes: Note[];
  loading: boolean;
}

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 60) + "...";

const formatTime = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${days} days ago`;
};

export default function NotesSection({ notes, loading }: NotesSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white text-sm">📝 Shared Notes</h2>
        <Link href="/dashboard/notes">
          <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>All notes</span>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-base-content/40 text-sm text-center py-4">No notes yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.slice(0, 2).map((n) => (
            <div
              key={n._id}
              className="rounded-lg p-3"
              style={{ background: "#6C63FF15", borderLeft: "3px solid #6C63FF" }}
            >
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-xs text-base-content/50 mt-1">{stripHtml(n.content)}</p>
              <p className="text-xs text-base-content/30 mt-2">
                {n.createdBy?.name} · {formatTime(n.updatedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}