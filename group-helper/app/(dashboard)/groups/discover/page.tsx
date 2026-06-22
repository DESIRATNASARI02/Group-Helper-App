"use client";

import { useState, useEffect } from "react";
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

export default function DiscoverGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : data.groups || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    setJoining(groupId);
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
      if (res.ok) router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(null);
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.topic.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col gap-6" data-theme="night">

      <Topbar
        title="Discover Groups"
        subtitle="Find and join study groups that match your interests"
        actions={
          <a href="/groups/create">
            <button className="btn btn-sm text-white" style={{ background: "#6C63FF" }}>
              + Create Group
            </button>
          </a>
        }
      />

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">🔍</span>
        <input
          type="text"
          placeholder="Search by name or topic..."
          className="input input-bordered w-full pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-medium">No groups found</p>
          <p className="text-base-content/50 text-sm mt-1">Try a different search or create a new group</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((group) => (
            <GroupCard
              key={group._id}
              id={group._id}
              name={group.name}
              description={group.description}
              topic={group.topic}
              memberCount={group.members?.length || 0}
              actionLabel="Join Group"
              onAction={handleJoin}
              loading={joining === group._id}
            />
          ))}
        </div>
      )}

      <p className="text-center text-base-content/40 text-sm">
        Can't find what you're looking for?{" "}
        <a href="/groups/create" className="hover:underline" style={{ color: "#6C63FF" }}>
          Create a new group
        </a>
      </p>
    </div>
  );
}