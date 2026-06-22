import Avatar from "@/components/ui/Avatar";

export interface OnlineMember {
  initials: string;
  color: string;
  textColor: string;
  name: string;
  online: boolean;
}

interface OnlineMembersProps {
  members: OnlineMember[];
}

export default function OnlineMembers({ members }: OnlineMembersProps) {
  const onlineCount = members.filter((m) => m.online).length;

  return (
    <div className="p-2 border-t border-white/10">
      <p className="text-xs text-base-content/40 uppercase tracking-wider px-2 py-1 mb-2">
        Online — {onlineCount}
      </p>
      {members.map((m, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1">
          <div className="relative">
            <Avatar initials={m.initials} color={m.color} textColor={m.textColor} size="sm" />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-base-100"
              style={{ background: m.online ? "#1D9E75" : "#888" }}
            />
          </div>
          <span className="text-xs text-base-content/50">{m.name}</span>
        </div>
      ))}
    </div>
  );
}