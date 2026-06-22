import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { GroupProvider } from "@/lib/context/GroupContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <GroupProvider>
      <div className="flex min-h-screen" data-theme="night">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </GroupProvider>
  );
}