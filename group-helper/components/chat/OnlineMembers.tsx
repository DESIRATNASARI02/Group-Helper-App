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
  return (
    <div className="p-2 border-t border-white/10">
      <p className="text-xs text-base-content/40 uppercase tracking-wider px-2 py-1 mb-2">
        Active Members — {members.length} 
      </p>
      {members.map((m, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1">
          <Avatar initials={m.initials} color={m.color} textColor={m.textColor} size="sm" /> 
          <span className="text-xs text-base-content/50">{m.name}</span>
        </div>
      ))}
    </div>
  );
}