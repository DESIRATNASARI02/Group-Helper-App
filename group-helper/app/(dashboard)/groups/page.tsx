"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Topbar from "@/components/ui/Topbar";
import GroupCard from "@/components/groups/GroupCard";

interface Group {
  _id: string;
  name: string;
  description: string;
  topic: string;
  members: string[];
}

export default function GroupsPage() {
  const router = useRouter();
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const res = await fetch("/api/groups/my");
      if (res.ok) {
        const data = await res.json();
        setMyGroups(data.groups || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="My Groups"
        subtitle="Manage your study groups"
        actions={
          <div className="flex gap-3">
            <Link href="/groups/discover">
              <button className="btn btn-outline btn-sm gap-2">🔍 Discover</button>
            </Link>
            <Link href="/groups/create">
              <button className="btn btn-sm text-white gap-2" style={{ background: "#6C63FF" }}>
                ✏️ Create Group
              </button>
            </Link>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : myGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden">
            <Image src="/group-helper-logo.png" alt="Logo" width={96} height={96} className="object-cover w-full h-full" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">No groups yet</h2>
            <p className="text-base-content/50 text-sm mt-1">Join an existing group or create your own</p>
          </div>
          <div className="flex gap-4">
            <Link href="/groups/discover">
              <button className="btn btn-outline gap-2">🔍 Discover Groups</button>
            </Link>
            <Link href="/groups/create">
              <button className="btn text-white gap-2" style={{ background: "#6C63FF" }}>✏️ Create Group</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myGroups.map((group) => (
            <GroupCard
              key={group._id}
              id={group._id}
              name={group.name}
              description={group.description}
              topic={group.topic}
              memberCount={group.members?.length || 0}
              actionLabel="Open Group →"
              onAction={(id) => router.push(`/dashboard?groupId=${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}