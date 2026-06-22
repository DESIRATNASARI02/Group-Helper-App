"use client";

import { useState, useEffect } from "react";
import NotesFilter from "@/components/notes/NotesFilter";
import NotesList from "@/components/notes/NotesList";
import NoteEditor from "@/components/notes/NoteEditor";
import { useGroup } from "@/lib/context/GroupContext";

interface Note {
  _id?: string;
  id: string;
  title: string;
  content: string;
  preview: string;
  author: string;
  time: string;
  tags: string[];
  color: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const allTags = ["All", "Next.js", "MongoDB", "Auth", "CSS", "Deploy", "Chat"];

const tagColors: Record<string, string> = {
  "Next.js": "#6C63FF",
  "MongoDB": "#1D9E75",
  "Auth": "#EF9F27",
  "CSS": "#888780",
  "Deploy": "#E24B4A",
  "Chat": "#1D9E75",
  "default": "#6C63FF",
};

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80) + "...";
};

const formatTime = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function NotesPage() {
  const { activeGroup } = useGroup();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>(["Next.js"]);
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

  useEffect(() => {
    if (activeGroup) fetchNotes();
  }, [activeGroup]);

  const fetchNotes = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?groupId=${activeGroup._id}`);
      if (res.ok) {
        const data = await res.json();
        const formatted: Note[] = data.map((note: any) => ({
          _id: note._id,
          id: note._id,
          title: note.title,
          content: note.content,
          preview: stripHtml(note.content),
          author: note.createdBy?.name || "Unknown",
          time: formatTime(note.updatedAt),
          tags: note.tags?.length > 0 ? note.tags : ["Next.js"],
          color: tagColors[note.tags?.[0]] || tagColors["default"],
        }));
        setNotes(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notes.filter((n) => {
    const matchTag = activeTag === "All" || n.tags.includes(activeTag);
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const handleSelectNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags);
      setIsCreating(false);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setEditTitle("");
    setEditContent("");
    setEditTags(["Next.js"]);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !activeGroup) return;

    try {
      if (isCreating) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: activeGroup._id,
            title: editTitle,
            content: editContent,
            tags: editTags,
          }),
        });
        if (res.ok) {
          await fetchNotes();
          setIsCreating(false);
        }
      } else if (selectedNote?._id) {
        const res = await fetch(`/api/notes/${selectedNote._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
            tags: editTags,
          }),
        });
        if (res.ok) {
          await fetchNotes();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewNoteFromChat = async (title: string, content: string) => {
    if (!activeGroup) return;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: activeGroup._id,
          title,
          content,
          tags: ["Chat"],
        }),
      });
      if (res.ok) {
        await fetchNotes();
        setEditTitle(title);
        setEditContent(content);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!activeGroup) {
    return (
      <div className="flex h-screen items-center justify-center" data-theme="night">
        <div className="text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-white font-medium">No active group selected</p>
          <p className="text-base-content/50 text-sm">Select a group from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" data-theme="night">

      {/* Notes Sidebar */}
      <div
        className="w-72 flex flex-col border-r border-white/10 flex-shrink-0"
        style={{ background: "#151528" }}
      >
        <NotesFilter
          tags={allTags}
          activeTag={activeTag}
          search={search}
          onTagChange={setActiveTag}
          onSearchChange={setSearch}
          onNewNote={handleNewNote}
        />

        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner" style={{ color: "#6C63FF" }}></span>
            </div>
          ) : (
            <NotesList notes={filtered} onSelect={handleSelectNote} />
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote || isCreating ? (
         <NoteEditor
          title={editTitle}
          content={editContent}
          author={user?.name || "Me"}
          groupId={activeGroup?._id}
          tags={editTags}
          onTitleChange={setEditTitle}
          onContentChange={setEditContent}
          onTagsChange={setEditTags}
          onSave={handleSave}
          onClose={() => {
            setSelectedNote(null);
            setIsCreating(false);
          }}
          onNewNoteFromChat={handleNewNoteFromChat}
        />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-4xl">📝</p>
            <p className="text-white font-medium">Select a note to view</p>
            <p className="text-base-content/40 text-sm">or create a new one</p>
            <button
              onClick={handleNewNote}
              className="btn btn-sm text-white"
              style={{ background: "#6C63FF" }}
            >
              + Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}