"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Group {
  _id: string;
  name: string;
  topic: string;
  description?: string;
  members: string[];
}

interface GroupContextType {
  activeGroup: Group | null;
  groups: Group[];
  setActiveGroup: (group: Group) => void;
  loading: boolean;
}

const GroupContext = createContext<GroupContextType>({
  activeGroup: null,
  groups: [],
  setActiveGroup: () => {},
  loading: true,
});

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups/my");
        if (res.ok) {
          const data = await res.json();
          const fetchedGroups = data.groups || [];
          setGroups(fetchedGroups);
          if (fetchedGroups.length > 0) {
            setActiveGroup(fetchedGroups[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider value={{ activeGroup, groups, setActiveGroup, loading }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroup = () => useContext(GroupContext);