"use client";

import { useState, useEffect } from "react";
import NotesFilter from "@/components/notes/NotesFilter";
import NotesList from "@/components/notes/NotesList";
import NoteEditor from "@/components/notes/NoteEditor";
import Modal from "@/components/ui/Modal";
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

const tagColors: Record<string, string> = {
  "Next.js": "#6C63FF",
  "MongoDB": "#1D9E75",
  "Auth": "#EF9F27",
  "CSS": "#888780",
  "Deploy": "#E24B4A",
  "Chat": "#1D9E75",
  "General": "#6C63FF",
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
  const [editTags, setEditTags] = useState<string[]>(["General"]); 
  const [user, setUser] = useState<User | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNote, setPendingNote] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [allTags, setAllTags] = useState<string[]>(["All"]); 

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
          tags: note.tags?.length > 0 ? note.tags : ["General"], 
          color: tagColors[note.tags?.[0]] || tagColors["default"],
        }));
        setNotes(formatted);

        const uniqueTags = ["All", ...Array.from(
          new Set(formatted.flatMap((n) => n.tags))
        )];
        setAllTags(uniqueTags);
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

  const openNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags);
      setOriginalTitle(note.title);
      setOriginalContent(note.content);
      setIsCreating(false);
      setIsDirty(false);
    }
  };

  const openNewNote = () => {
    setSelectedNote(null);
    setEditTitle("");
    setEditContent("");
    setEditTags(["General"]); 
    setOriginalTitle("");
    setOriginalContent("");
    setIsCreating(true);
    setIsDirty(false);
  };

  const handleSelectNote = (id: string) => {
    if (selectedNote?.id === id && !isCreating) return;

    if (isDirty) {
      setPendingNote(id);
      setShowUnsavedModal(true);
      return;
    }

    openNote(id);
  };

  const handleNewNote = () => {
    if (isDirty) {
      setPendingNote("new");
      setShowUnsavedModal(true);
      return;
    }
    openNewNote();
  };

  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    setIsDirty(val !== originalTitle || editContent !== originalContent);
  };

  const handleContentChange = (val: string) => {
    setEditContent(val);
    setIsDirty(editTitle !== originalTitle || val !== originalContent);
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
          setIsDirty(false);
          setIsCreating(false);

          if (pendingNote && pendingNote !== "new") {
            openNote(pendingNote);
          } else if (pendingNote === "new") {
            openNewNote();
          } else {
            setSelectedNote(null);
            setIsCreating(false);
          }
          setPendingNote(null);
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
          setIsDirty(false);
          setOriginalTitle(editTitle);
          setOriginalContent(editContent);

          if (pendingNote) {
            if (pendingNote === "new") {
              openNewNote();
            } else {
              openNote(pendingNote);
            }
            setPendingNote(null);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscard = () => {
    setShowUnsavedModal(false);
    setIsDirty(false);

    if (pendingNote === "new") {
      openNewNote();
    } else if (pendingNote) {
      openNote(pendingNote);
    } else {
      setSelectedNote(null);
      setIsCreating(false);
    }
    setPendingNote(null);
  };

  const handleClose = () => {
    if (isDirty) {
      setPendingNote(null);
      setShowUnsavedModal(true);
      return;
    }
    setSelectedNote(null);
    setIsCreating(false);
    setIsDirty(false);
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
        setIsDirty(false);
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
            key={selectedNote?.id || "new"}
            title={editTitle}
            content={editContent}
            author={user?.name || "Me"}
            groupId={activeGroup._id}
            tags={editTags}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onTagsChange={setEditTags}
            onSave={handleSave}
            onClose={handleClose}
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

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        title="Unsaved Changes"
      >
        <p className="text-base-content/70 text-sm">
          You have unsaved changes. What would you like to do?
        </p>
        <div className="flex gap-3 mt-4">
          <button
            className="btn btn-outline flex-1"
            onClick={() => setShowUnsavedModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-error flex-1"
            onClick={handleDiscard}
          >
            Discard
          </button>
          <button
            className="btn flex-1 text-white"
            style={{ background: "#6C63FF" }}
            onClick={() => {
              setShowUnsavedModal(false);
              handleSave();
            }}
          >
            Save
          </button>
        </div>
      </Modal>

    </div>
  );
}