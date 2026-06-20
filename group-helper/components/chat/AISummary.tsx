interface AISummaryProps {
  summary: string;
  onClose: () => void;
}

export default function AISummary({ summary, onClose }: AISummaryProps) {
  if (!summary) return null;

  return (
    <div
      className="mx-4 mt-3 p-4 rounded-xl border border-purple-500/30 .flex-shrink-0"
      style={{ background: "#2a1f5e" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-purple-300">✨ AI Summary</span>
        <button
          className="text-xs text-base-content/40 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-white/80 whitespace-pre-line">{summary}</p>
    </div>
  );
}