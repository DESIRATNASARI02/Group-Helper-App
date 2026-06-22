"use client";

import { useState } from "react";
import AINoteSummary from "@/components/notes/AINoteSummary";
import DownloadPDF from "@/components/notes/DownloadPDF";

interface NoteEditorProps {
  title: string;
  content: string;
  author?: string;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
  onNewNoteFromChat?: (title: string, content: string) => void;
  loading?: boolean;
}

const toolbarButtons = [
  { label: "B", style: "font-bold" },
  { label: "I", style: "italic" },
  { label: "U", style: "underline" },
];

export default function NoteEditor({
  title,
  content,
  author = "Desi",
  onTitleChange,
  onContentChange,
  onSave,
  onClose,
  onNewNoteFromChat,
  loading = false,
}: NoteEditorProps) {
  const [loadingSummarize, setLoadingSummarize] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarizeNote = async () => {
    if (!content.trim()) return;
    setLoadingSummarize(true);
    setSummary("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSummary(
        "📌 Key Points:\n• Server components render on the server before being sent to browser\n• Client components require 'use client' directive\n• SSR is better for SEO\n• CSR allows use of React hooks like useState and useEffect"
      );
    } finally {
      setLoadingSummarize(false);
    }
  };

  const handleSaveChatAsNote = async () => {
    setLoadingChat(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const chatSummary = "📝 Notes from Chat Discussion:\n\n• Team discussed auth branch push status\n• JWT implementation is in progress\n• GC02 deadline confirmed for Jun 18 at 18:00\n• Tonight's study session confirmed at 20:00\n• MongoDB schema design is 90% complete";
      if (onNewNoteFromChat) {
        onNewNoteFromChat("Chat Summary — " + new Date().toLocaleDateString(), chatSummary);
      }
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Editor Topbar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: "#1a1a2e" }}
      >
        <input
          type="text"
          placeholder="Note title..."
          className="bg-transparent outline-none text-white font-semibold text-base flex-1 placeholder:text-base-content/30"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <DownloadPDF title={title} content={content} author={author} />
          <button
            className="btn btn-ghost btn-sm text-base-content/40"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`btn btn-sm text-white ${loading ? "loading" : ""}`}
            style={{ background: "#6C63FF" }}
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b border-white/10"
        style={{ background: "#1a1a2e" }}
      >
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            className={`w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10 ${btn.style}`}
          >
            {btn.label}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <button className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10">H1</button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10">H2</button>
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <button className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10">•</button>
        <button className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10">{"</>"}</button>
      </div>

      {/* Content */}
      <textarea
        className="flex-1 bg-transparent outline-none text-white text-sm p-4 resize-none placeholder:text-base-content/30"
        placeholder="Start writing your note..."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />

      {/* AI Features */}
      <div
        className="px-4 py-3 border-t border-white/10"
        style={{ background: "#1a1a2e" }}
      >
        <AINoteSummary
          onSummarizeNote={handleSummarizeNote}
          onSaveChatAsNote={handleSaveChatAsNote}
          loadingSummarize={loadingSummarize}
          loadingChat={loadingChat}
          summary={summary}
          onCloseSummary={() => setSummary("")}
        />
      </div>
    </div>
  );
}