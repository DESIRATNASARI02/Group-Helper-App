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
const hours = Array.from({ length: 24 }, (_, i) => i);

const CELL_HEIGHT = 60;

function getWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
}

function formatDateStr(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + (m || 0);
}

export default function WeeklyCalendar({ schedules }: WeeklyCalendarProps) {
    const weekDates = getWeekDates();
    const todayStr = formatDateStr(new Date());

    const getSchedulesForDay = (date: Date) =>
        schedules.filter((s) => s.date === formatDateStr(date));

    const getTopPosition = (startTime: string) =>
        (timeToMinutes(startTime) / 60) * CELL_HEIGHT;

    const getHeight = (startTime: string, endTime: string) => {
        const diff = timeToMinutes(endTime) - timeToMinutes(startTime);

        return Math.max((diff / 60) * CELL_HEIGHT, 60);
    };

    const totalHeight = hours.length * CELL_HEIGHT;

    return (
        <div
            className="rounded-2xl overflow-hidden border border-white/10"
            style={{ background: "#1e1e3a" }}
        >
            {/* Header */}
            <div
                className="grid border-b border-white/10"
                style={{
                    gridTemplateColumns: "70px repeat(7, minmax(0,1fr))",
                }}
            >
                <div className="border-r border-white/10" />

                {weekDates.map((date, i) => {
                    const isToday = formatDateStr(date) === todayStr;

                    return (
                        <div
                            key={i}
                            className="py-4 text-center border-r border-white/10 last:border-r-0"
                        >
                            <p className="text-xs text-white/50 mb-2">
                                {days[i]}
                            </p>

                            <div
                                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                                    isToday ? "text-white" : "text-white/60"
                                }`}
                                style={isToday ? { background: "#6C63FF" } : {}}
                            >
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Calendar Body */}
            <div
                className="overflow-y-scroll"
                style={{
                    maxHeight: "600px",
                    scrollbarGutter: "stable",
                }}
            >
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: "70px repeat(7, minmax(0,1fr))",
                        height: `${totalHeight}px`,
                    }}
                >
                    {/* Time Column */}
                    <div className="relative border-r border-white/10">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full border-b border-white/5"
                                style={{
                                    top: `${hour * CELL_HEIGHT}px`,
                                    height: `${CELL_HEIGHT}px`,
                                }}
                            >
                                <span className="absolute top-1 right-2 text-xs text-white/30">
                                    {String(hour).padStart(2, "0")}:00
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    {weekDates.map((date, dayIndex) => {
                        const isToday = formatDateStr(date) === todayStr;

                        const daySchedules = getSchedulesForDay(date);

                        return (
                            <div
                                key={dayIndex}
                                className="relative border-r border-white/10 last:border-r-0"
                                style={{
                                    height: `${totalHeight}px`,
                                }}
                            >
                                {/* Hour lines */}
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="absolute w-full border-b border-white/5"
                                        style={{
                                            top: `${hour * CELL_HEIGHT}px`,
                                            height: `${CELL_HEIGHT}px`,
                                        }}
                                    />
                                ))}

                                {/* Today Background */}
                                {isToday && (
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            background: "rgba(108,99,255,0.05)",
                                        }}
                                    />
                                )}

                                {/* Events */}
                                {daySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="absolute z-10 rounded-xl p-2 overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition"
                                        style={{
                                            top: `${getTopPosition(
                                                schedule.startTime,
                                            )}px`,
                                            height: `${getHeight(
                                                schedule.startTime,
                                                schedule.endTime,
                                            )}px`,
                                            left: "4px",
                                            width: "calc(100% - 8px)",
                                            background: `${schedule.color}dd`,
                                            borderLeft: `4px solid ${schedule.color}`,
                                        }}
                                    >
                                        <p className="text-white text-sm font-medium truncate">
                                            {schedule.title}
                                        </p>

                                        <p className="text-white/70 text-xs mt-1">
                                            {schedule.startTime} -{" "}
                                            {schedule.endTime}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
