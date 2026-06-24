"use client";

import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

interface Member {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

const avatarColorMap: Record<string, string> = {
  "#CECBF6": "#3C3489",
  "#9FE1CB": "#085041",
  "#F5C4B3": "#712B13",
  "#FAC775": "#633806",
  "#B5D4F4": "#0C447C",
  "#C0DD97": "#27500A",
};

const getTextColor = (bgColor?: string) => {
  if (!bgColor) return "#3C3489";
  return avatarColorMap[bgColor] || "#3C3489";
};

interface MembersSectionProps {
  members: Member[];
  loading: boolean;
}

export default function MembersSection({ members, loading }: MembersSectionProps) {
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white text-sm">👥 Members</h2>
        <span className="text-xs text-base-content/40">{members.length} total</span>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : members.length === 0 ? (
        <p className="text-base-content/40 text-sm text-center py-4">No members yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member, i) => (
            <div key={member._id} className="flex items-center gap-3">
              <Avatar
                initials={getInitials(member.name)}
                color={member.avatarColor || "#CECBF6"}
                textColor={getTextColor(member.avatarColor)}
                size="md"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-base-content/40">
                  {i === 0 ? "Captain" : "Member"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}