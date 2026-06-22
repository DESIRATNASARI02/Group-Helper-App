interface NoteCardProps {
  id: string;
  title: string;
  preview: string;
  author: string;
  time: string;
  tags: string[];
  color: string;
  onClick: (id: string) => void;
}

const tagColors: Record<string, { bg: string; color: string }> = {
  "Next.js": { bg: "#EEEDFE", color: "#534AB7" },
  "MongoDB": { bg: "#E1F5EE", color: "#085041" },
  "Auth": { bg: "#FAEEDA", color: "#854F0B" },
  "CSS": { bg: "#F1EFE8", color: "#5F5E5A" },
  "Deploy": { bg: "#FCEBEB", color: "#A32D2D" },
  "default": { bg: "#F1EFE8", color: "#5F5E5A" },
};

export default function NoteCard({
  id,
  title,
  preview,
  author,
  time,
  tags,
  color,
  onClick,
}: NoteCardProps) {
  return (
    <div
      className="rounded-xl p-4 cursor-pointer hover:opacity-90 transition-all border border-white/5 hover:border-white/20"
      style={{ background: "#1e1e3a", borderLeft: `3px solid ${color}` }}
      onClick={() => onClick(id)}
    >
      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((tag, i) => {
          const tc = tagColors[tag] || tagColors["default"];
          return (
            <span
              key={i}
              className="badge badge-sm font-medium"
              style={{ background: tc.bg, color: tc.color }}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>

      {/* Preview */}
      <p className="text-base-content/50 text-xs line-clamp-2 mb-3">{preview}</p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-base-content/30">{author}</span>
        <span className="text-xs text-base-content/30">{time}</span>
      </div>
    </div>
  );
}