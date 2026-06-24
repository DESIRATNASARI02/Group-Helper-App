"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Group {
  _id: string;
  name: string;
  topic: string;
  description?: string;
  members: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatarColor?: string;
}

interface GroupContextType {
  activeGroup: Group | null;
  groups: Group[];
  setActiveGroup: (group: Group) => void;
  resetActiveGroup: () => void;
  loading: boolean;
  user: User | null;
  setUser: (user: User) => void;
}

const GroupContext = createContext<GroupContextType>({
  activeGroup: null,
  groups: [],
  setActiveGroup: () => {},
  resetActiveGroup: () => {},
  loading: true,
  user: null,
  setUser: () => {},
});

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/groups/my");
        if (res.ok) {
          const data = await res.json();
          const fetchedGroups = data.groups || [];
          setGroups(fetchedGroups);

          if (fetchedGroups.length > 0) {
            const savedGroupId = localStorage.getItem("activeGroupId");
            const savedGroup = fetchedGroups.find((g: Group) => g._id === savedGroupId);
            if (savedGroup) {
              setActiveGroup(savedGroup);
            } else {
              setActiveGroup(fetchedGroups[0]);
              localStorage.setItem("activeGroupId", fetchedGroups[0]._id);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
    fetchUser();
  }, []);

  const handleSetActiveGroup = (group: Group) => {
    setActiveGroup(group);
    localStorage.setItem("activeGroupId", group._id);
  };

  const resetActiveGroup = () => {
    const remainingGroups = groups.filter((g) => g._id !== activeGroup?._id); 
    setGroups(remainingGroups);

    if (remainingGroups.length > 0) {
      setActiveGroup(remainingGroups[0]);
      localStorage.setItem("activeGroupId", remainingGroups[0]._id);
    } else { 
      setActiveGroup(null);
      localStorage.removeItem("activeGroupId");
    }
  };

  return (
    <GroupContext.Provider
      value={{
        activeGroup,
        groups,
        setActiveGroup: handleSetActiveGroup,
        resetActiveGroup,
        loading,
        user,
        setUser,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export const useGroup = () => useContext(GroupContext);