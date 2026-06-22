interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
}

export default function Badge({
  label,
  color = "#534AB7",
  bg = "#EEEDFE",
}: BadgeProps) {
  return (
    <span
      className="badge badge-sm font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}