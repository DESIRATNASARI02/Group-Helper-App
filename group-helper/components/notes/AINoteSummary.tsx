"use client";

import ReactMarkdown from "react-markdown"; 

interface AINoteSummaryProps {
  onSummarizeNote: () => void;
  onSaveChatAsNote: () => void;
  loadingSummarize: boolean;
  loadingChat: boolean;
  summary: string;
  onCloseSummary: () => void;
}

export default function AINoteSummary({
  onSummarizeNote,
  onSaveChatAsNote,
  loadingSummarize,
  loadingChat,
  summary,
  onCloseSummary,
}: AINoteSummaryProps) {
  return (
    <div className="flex flex-col gap-2">

      {/* AI Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onSummarizeNote}
          className={`btn btn-xs flex-1 text-white gap-1 ${loadingSummarize ? "loading" : ""}`}
          style={{ background: "#6C63FF" }}
          disabled={loadingSummarize || loadingChat}
        >
          {!loadingSummarize && <span>✨</span>}
          {loadingSummarize ? "Summarizing..." : "Summarize Note"}
        </button>

        <button
          onClick={onSaveChatAsNote}
          className={`btn btn-xs flex-1 gap-1 ${loadingChat ? "loading" : ""}`}
          style={{ background: "#1D9E75", color: "white" }}
          disabled={loadingSummarize || loadingChat}
        >
          {!loadingChat && <span>💬</span>}
          {loadingChat ? "Saving..." : "Save Chat as Note"}
        </button>
      </div>

      {/* Summary Result */}
      {summary && (
        <div
          className="rounded-xl p-3 border border-purple-500/30"
          style={{ background: "#2a1f5e" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-300">✨ AI Summary</span>
            <button
              className="text-xs text-base-content/40 hover:text-white"
              onClick={onCloseSummary}
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-white/80 prose prose-invert max-w-none prose-sm"> 
            <ReactMarkdown>{summary}</ReactMarkdown> 
          </div>
        </div>
      )}
    </div>
  );
}