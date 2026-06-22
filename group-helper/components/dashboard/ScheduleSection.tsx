import Link from "next/link";
import Card from "@/components/ui/Card";

interface Schedule {
  _id: string;
  title: string;
  startTime: string;
  members: string;
  type: string;
}

const typeColors: Record<string, string> = {
  study: "#6C63FF",
  review: "#1D9E75",
  exam: "#E24B4A",
  meeting: "#EF9F27",
};

interface ScheduleSectionProps {
  schedules: Schedule[];
  loading: boolean;
}

export default function ScheduleSection({ schedules, loading }: ScheduleSectionProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-white text-sm">📅 Today's Schedule</h2>
        <Link href="/dashboard/schedule">
          <span className="text-xs cursor-pointer hover:underline" style={{ color: "#6C63FF" }}>Calendar</span>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm" style={{ color: "#6C63FF" }}></span>
        </div>
      ) : schedules.length === 0 ? (
        <p className="text-base-content/40 text-sm text-center py-4">No sessions planned</p>
      ) : (
        <div className="flex flex-col gap-3">
          {schedules.slice(0, 3).map((s) => (
            <div key={s._id} className="flex items-center gap-3">
              <span className="text-xs text-base-content/40 w-10">{s.startTime}</span>
              <div
                className="w-1 h-10 rounded-full flex-shrink-0"
                style={{ background: typeColors[s.type] || "#6C63FF" }}
              ></div>
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-base-content/50">{s.members || "All members"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}