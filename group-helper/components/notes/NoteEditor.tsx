"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import AINoteSummary from "@/components/notes/AINoteSummary";
import DownloadPDF from "@/components/notes/DownloadPDF";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

interface NoteEditorProps {
  title: string;
  content: string;
  author?: string;
  groupId?: string;
  tags?: string[];
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onSave: () => void;
  onClose: () => void;
  onNewNoteFromChat?: (title: string, content: string) => void;
  loading?: boolean;
}

const availableTags = ["Next.js", "MongoDB", "Auth", "CSS", "Deploy", "Chat", "React", "TypeScript", "Node.js", "Other"];

export default function NoteEditor({
  title,
  content,
  author = "Me",
  groupId,
  tags = ["Next.js"],
  onTitleChange,
  onContentChange,
  onTagsChange,
  onSave,
  onClose,
  onNewNoteFromChat,
  loading = false,
}: NoteEditorProps) {
  const [loadingSummarize, setLoadingSummarize] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [summary, setSummary] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);

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
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInsertImageUrl = () => {
    if (!imageUrl.trim() || !editor) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImageModal(false);
  };

  const handleSummarizeNote = async () => {
    if (!editor) return;
    setLoadingSummarize(true);
    setSummary("");
    try {
      const res = await fetch("/api/notes/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editor.getText() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummarize(false);
    }
  };

  const handleSaveChatAsNote = async () => {
    if (!groupId) return;
    setLoadingChat(true);
    try {
      const res = await fetch("/api/chat/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onNewNoteFromChat) {
          onNewNoteFromChat(
            "Ringkasan Chat — " + new Date().toLocaleDateString(),
            data.summary
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSave = () => {
    if (editor) onContentChange(editor.getHTML());
    onSave();
  };

  const handleToggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    if (onTagsChange) onTagsChange(newTags);
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
          {/* Tag selector */}
          <button
            onClick={() => setShowTagModal(true)}
            className="btn btn-ghost btn-xs gap-1 text-base-content/40 hover:text-white"
          >
            🏷️ {selectedTags.length > 0 ? selectedTags.join(", ") : "Add tags"}
          </button>
          <DownloadPDF title={title} content={editor.getHTML()} author={author} />
          <button className="btn btn-ghost btn-sm text-base-content/40" onClick={onClose}>
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
        >B</button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm italic transition-all ${
            editor.isActive("italic") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >I</button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
            editor.isActive("strike") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        ><s>S</s></button>
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("heading", { level: 1 }) ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >H1</button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("heading", { level: 2 }) ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >H2</button>
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
            editor.isActive("bulletList") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >•</button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("orderedList") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >1.</button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
            editor.isActive("codeBlock") ? "bg-white/20 text-white" : "text-base-content/50 hover:text-white hover:bg-white/10"
          }`}
        >{"</>"}</button>
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <label
          className={`w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10 cursor-pointer transition-all ${uploadingImage ? "opacity-50" : ""}`}
          title="Upload image"
        >
          {uploadingImage ? "⏳" : "🖼️"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={uploadingImage} />
        </label>
        <button
          onClick={() => setShowImageModal(true)}
          className="w-7 h-7 rounded flex items-center justify-center text-sm text-base-content/50 hover:text-white hover:bg-white/10 transition-all"
          title="Insert image URL"
        >🔗</button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* AI Features */}
      <div className="px-4 py-3 border-t border-white/10" style={{ background: "#1a1a2e" }}>
        <AINoteSummary
          onSummarizeNote={handleSummarizeNote}
          onSaveChatAsNote={handleSaveChatAsNote}
          loadingSummarize={loadingSummarize}
          loadingChat={loadingChat}
          summary={summary}
          onCloseSummary={() => setSummary("")}
        />
      </div>

      {/* Modal Insert Image URL */}
      <Modal
        isOpen={showImageModal}
        onClose={() => { setShowImageModal(false); setImageUrl(""); }}
        title="Insert Image URL"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Image URL</span>
          </label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            className="input input-bordered w-full"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleInsertImageUrl(); }}
          />
        </div>
        {imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex gap-3 mt-2">
          <button className="btn btn-outline flex-1" onClick={() => { setShowImageModal(false); setImageUrl(""); }}>Cancel</button>
          <button
            className="btn flex-1 text-white font-bold"
            style={{ background: "#6C63FF" }}
            onClick={handleInsertImageUrl}
            disabled={!imageUrl.trim()}
          >Insert Image</button>
        </div>
      </Modal>

      {/* Modal Tags */}
      <Modal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        title="Select Tags"
      >
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleToggleTag(tag)}
              className="badge badge-lg cursor-pointer transition-all"
              style={
                selectedTags.includes(tag)
                  ? { background: "#6C63FF", color: "white" }
                  : { background: "#2a2a4a", color: "white" }
              }
            >
              {selectedTags.includes(tag) ? "✓ " : ""}{tag}
            </button>
          ))}
        </div>
        <button
          className="btn w-full text-white mt-4"
          style={{ background: "#6C63FF" }}
          onClick={() => setShowTagModal(false)}
        >
          Done
        </button>
      </Modal>

    </div>
  );
}