interface AvatarProps {
  initials: string;
  color?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-xs",
  lg: "w-12 h-12 text-base",
};

export default function Avatar({
  initials,
  color = "#CECBF6",
  textColor = "#3C3489",
  size = "md",
}: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold .flex-shrink-0`}
      style={{ background: color, color: textColor }}
    >
      {initials}
    </div>
  );
}