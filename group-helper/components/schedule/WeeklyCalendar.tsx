"use client";

interface Schedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "study" | "review" | "exam" | "meeting";
  members: string;
  color: string;
}

interface WeeklyCalendarProps {
  schedules: Schedule[];
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

const typeColors = {
  study: "#6C63FF",
  review: "#1D9E75",
  exam: "#E24B4A",
  meeting: "#EF9F27",
};

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function WeeklyCalendar({ schedules }: WeeklyCalendarProps) {
  const weekDates = getWeekDates();
  const today = new Date();

  const getSchedulesForDay = (date: Date) => {
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return schedules.filter((s) => s.date === dateStr);
  };

  const getTopPosition = (startTime: string) => {
    const minutes = timeToMinutes(startTime) - 7 * 60;
    return (minutes / 60) * 56;
  };

  const getHeight = (startTime: string, endTime: string) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    return ((end - start) / 60) * 56;
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: "#1e1e3a" }}>

      {/* Header — Days */}
      <div className="grid grid-cols-8 border-b border-white/10">
        <div className="p-3 border-r border-white/10" />
        {weekDates.map((date, i) => {
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className="p-3 text-center border-r border-white/10 last:border-0"
            >
              <p className="text-xs text-base-content/40 mb-1">{days[i]}</p>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto ${
                  isToday ? "text-white" : "text-base-content/60"
                }`}
                style={isToday ? { background: "#6C63FF" } : {}}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Body — Time Grid */}
      <div className="grid grid-cols-8 overflow-y-auto" style={{ maxHeight: "480px" }}>

        {/* Time Labels */}
        <div className="border-r border-white/10">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-14 flex items-start justify-end pr-3 pt-1 border-b border-white/5"
            >
              <span className="text-xs text-base-content/30">
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {weekDates.map((date, dayIndex) => {
          const daySchedules = getSchedulesForDay(date);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={dayIndex}
              className="relative border-r border-white/10 last:border-0"
              style={{ height: `${hours.length * 56}px` }}
            >
              {/* Hour lines */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full border-b border-white/5"
                  style={{ top: `${(hour - 7) * 56}px`, height: "56px" }}
                />
              ))}

              {/* Today highlight */}
              {isToday && (
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: "#6C63FF" }}
                />
              )}

              {/* Schedule Events */}
              {daySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    top: `${getTopPosition(schedule.startTime)}px`,
                    height: `${Math.max(getHeight(schedule.startTime, schedule.endTime), 28)}px`,
                    background: `${schedule.color}cc`,
                    borderLeft: `3px solid ${schedule.color}`,
                  }}
                >
                  <p className="text-white text-xs font-medium truncate">{schedule.title}</p>
                  <p className="text-white/70 text-xs truncate">
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}