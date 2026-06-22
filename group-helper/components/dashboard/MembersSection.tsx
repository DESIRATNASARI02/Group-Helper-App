"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { useGroup } from "@/lib/context/GroupContext";

interface Member {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

export default function MembersSection() {
  const { activeGroup } = useGroup();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeGroup) return;
    fetchMembers();
  }, [activeGroup]);

  const fetchMembers = async () => {
    if (!activeGroup) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${activeGroup._id}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          {members.slice(0, 4).map((member, i) => (
            <div key={member._id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  initials={getInitials(member.name)}
                  color={member.avatarColor || "#CECBF6"}
                  textColor="#3C3489"
                  size="md"
                />
                <div
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-100"
                  style={{ background: "#1D9E75" }}
                />
              </div>
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