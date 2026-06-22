"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import AINoteSummary from "@/components/notes/AINoteSummary";
import DownloadPDF from "@/components/notes/DownloadPDF";
import { useState } from "react";

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

const editor = useEditor({
  extensions: [
    StarterKit,
    TiptapImage.configure({ inline: true }),
  ],
  content,
  immediatelyRender: false,
  onUpdate: ({ editor }) => {
    onContentChange(editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: "prose prose-invert max-w-none focus:outline-none min-h-64 p-4 text-white text-sm",
    },
  },
});

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSummarizeNote = async () => {
    if (!editor) return;
    setLoadingSummarize(true);
    setSummary("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSummary(
        "📌 Poin Penting:\n• Server components di-render di server sebelum dikirim ke browser\n• Client components memerlukan directive 'use client'\n• SSR lebih baik untuk SEO\n• CSR memungkinkan penggunaan React hooks"
      );
    } finally {
      setLoadingSummarize(false);
    }
  };

  const handleSaveChatAsNote = async () => {
    setLoadingChat(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const chatSummary = "📝 Catatan dari Diskusi Chat:\n\n• Tim mendiskusikan status push branch auth\n• Implementasi JWT sedang berjalan\n• Deadline GC02 dikonfirmasi 18 Jun pukul 18:00\n• Sesi belajar malam ini dikonfirmasi pukul 20:00";
      if (onNewNoteFromChat) {
        onNewNoteFromChat("Ringkasan Chat — " + new Date().toLocaleDateString(), chatSummary);
      }
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSave = () => {
    if (editor) {
      onContentChange(editor.getHTML());
    }
    onSave();
  };

  if (!editor) return null;

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
          <DownloadPDF title={title} content={editor.getHTML()} author={author} />
          <button
            className="btn btn-ghost btn-sm text-base-content/40"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`btn btn-sm text-white ${loading ? "loading" : ""}`}
            style={{ background: "#6C63FF" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b border-white/10 flex-wrap"
        style={{ background: "#1a1a2e" }}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold transition-all ${
            editor.isActive("bold") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm italic transition-all ${
            editor.isActive("italic") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
            editor.isActive("strike") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <s>S</s>
        </button>

        <div className="w-px h-4 bg-white/10 mx-1"></div>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("heading", { level: 1 }) ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("heading", { level: 2 }) ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          H2
        </button>

        <div className="w-px h-4 bg-white/10 mx-1"></div>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
            editor.isActive("bulletList") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("orderedList") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          1.
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("codeBlock") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >
          {"</>"}
        </button>

        <div className="w-px h-4 bg-white/10 mx-1"></div>

        {/* Upload Image */}
        <label className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10 cursor-pointer transition-all" title="Upload image">
          🖼️
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadImage}
          />
        </label>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

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