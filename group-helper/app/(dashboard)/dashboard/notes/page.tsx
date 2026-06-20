"use client";

import { useState } from "react";
import NotesFilter from "@/components/notes/NotesFilter";
import NotesList from "@/components/notes/NotesList";
import NoteEditor from "@/components/notes/NoteEditor";

interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  author: string;
  time: string;
  tags: string[];
  color: string;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "SSR vs CSR in Next.js",
    content: "Server components render on server, client components use 'use client' directive...\n\nServer-Side Rendering (SSR):\n- Components rendered on server before sent to browser\n- Better for SEO\n- Cannot use hooks like useState or useEffect\n- Default in Next.js App Router\n\nClient-Side Rendering (CSR):\n- Components rendered in browser\n- Can use React hooks\n- Add 'use client' at top of file",
    preview: "Server components render on server, client components use 'use client' directive...",
    author: "Desi",
    time: "2h ago",
    tags: ["Next.js"],
    color: "#6C63FF",
  },
  {
    id: "2",
    title: "MongoDB Atlas Setup",
    content: "Connection string format: mongodb+srv://user:pass@cluster...\n\nSteps:\n1. Create account at mongodb.com/atlas\n2. Create new cluster\n3. Go to Connect > Drivers\n4. Copy connection string\n5. Replace <password> with actual password\n6. Add to .env.local as MONGODB_URI",
    preview: "Connection string format: mongodb+srv://user:pass@cluster...",
    author: "Firhan",
    time: "5h ago",
    tags: ["MongoDB"],
    color: "#1D9E75",
  },
  {
    id: "3",
    title: "JWT Auth Flow",
    content: "How to implement middleware to protect routes with JWT...\n\n1. User login → server creates JWT token\n2. Token stored in httpOnly cookie\n3. Each request sends cookie automatically\n4. Middleware/proxy.ts verifies token\n5. If valid → allow access\n6. If invalid → redirect to login",
    preview: "How to implement middleware to protect routes with JWT...",
    author: "Desi",
    time: "Yesterday",
    tags: ["Auth"],
    color: "#EF9F27",
  },
  {
    id: "4",
    title: "Deployment Checklist",
    content: "Steps to deploy to Vercel:\n1. Push code to GitHub\n2. Connect repo to Vercel\n3. Add environment variables\n4. Deploy!\n\nEnvironment variables needed:\n- MONGODB_URI\n- JWT_SECRET\n- PUSHER_APP_ID\n- PUSHER_KEY\n- PUSHER_SECRET\n- GEMINI_API_KEY",
    preview: "Steps to deploy to Vercel and setup environment variables...",
    author: "Desi",
    time: "2 days ago",
    tags: ["Deploy"],
    color: "#E24B4A",
  },
];

const allTags = ["All", "Next.js", "MongoDB", "Auth", "CSS", "Deploy"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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
      setIsCreating(false);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setEditTitle("");
    setEditContent("");
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;

    if (isCreating) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: editTitle,
        content: editContent,
        preview: editContent.slice(0, 80) + "...",
        author: "Desi",
        time: "Just now",
        tags: ["Next.js"],
        color: "#6C63FF",
      };
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setIsCreating(false);
    } else if (selectedNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedNote.id
            ? {
                ...n,
                title: editTitle,
                content: editContent,
                preview: editContent.slice(0, 80) + "...",
                time: "Just now",
              }
            : n
        )
      );
      setSelectedNote({ ...selectedNote, title: editTitle, content: editContent });
    }
  };

  const handleNewNoteFromChat = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      preview: content.slice(0, 80) + "...",
      author: "AI",
      time: "Just now",
      tags: ["Chat"],
      color: "#1D9E75",
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setEditTitle(title);
    setEditContent(content);
    setIsCreating(false);
  };

  return (
    <div className="flex h-screen" data-theme="night">

      {/* Notes Sidebar */}
      <div
        className="w-72 flex flex-col border-r border-white/10 .flex-shrink-0"
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
          <NotesList notes={filtered} onSelect={handleSelectNote} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote || isCreating ? (
          <NoteEditor
            title={editTitle}
            content={editContent}
            onTitleChange={setEditTitle}
            onContentChange={setEditContent}
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