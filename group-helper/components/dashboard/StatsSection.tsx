import Card from "@/components/ui/Card";

interface StatsSectionProps {
  totalTasks: number;
  completedTasks: number;
  totalMembers: number;
  totalNotes: number;
  nextSession: { startTime: string; date: string } | null;
}

export default function StatsSection({
  totalTasks,
  completedTasks,
  totalMembers,
  totalNotes,
  nextSession,
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <p className="text-xs text-base-content/50 mb-1">✅ Total Tasks</p>
        <p className="text-2xl font-bold text-white">{totalTasks}</p>
        <p className="text-xs mt-1 text-success">{completedTasks} completed</p>
      </Card>
      <Card>
        <p className="text-xs text-base-content/50 mb-1">👥 Members</p>
        <p className="text-2xl font-bold text-white">{totalMembers}</p>
        <p className="text-xs mt-1 text-success">All active</p>
      </Card>
      <Card>
        <p className="text-xs text-base-content/50 mb-1">📝 Notes</p>
        <p className="text-2xl font-bold text-white">{totalNotes}</p>
        <p className="text-xs mt-1 text-base-content/50">{totalNotes} shared notes</p>
      </Card>
      <Card>
        <p className="text-xs text-base-content/50 mb-1">📅 Next Session</p>
        <p className="text-2xl font-bold text-white">
          {nextSession ? nextSession.startTime : "—"}
        </p>
        <p className="text-xs mt-1 text-error">
          {nextSession ? nextSession.date : "No upcoming session"}
        </p>
      </Card>
    </div>
  );
}