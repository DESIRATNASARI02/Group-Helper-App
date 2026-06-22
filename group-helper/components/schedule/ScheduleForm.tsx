"use client";

interface ScheduleFormProps {
  onAdd: (schedule: {
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    type: "study" | "review" | "exam" | "meeting";
    members: string;
  }) => void;
  onClose: () => void;
}

export default function ScheduleForm({ onAdd, onClose }: ScheduleFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    onAdd({
      title: data.get("title") as string,
      description: data.get("description") as string,
      date: data.get("date") as string,
      startTime: data.get("startTime") as string,
      endTime: data.get("endTime") as string,
      type: data.get("type") as "study" | "review" | "exam" | "meeting",
      members: data.get("members") as string,
    });
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Title</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Next.js Study Session"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Description</span>
          <span className="label-text-alt text-base-content/40">Optional</span>
        </label>
        <input
          type="text"
          name="description"
          placeholder="What will you study?"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Type</span>
        </label>
        <select name="type" className="select select-bordered w-full" defaultValue="study">
          <option value="study">Study Session</option>
          <option value="review">Review</option>
          <option value="exam">Exam</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Date</span>
        </label>
        <input
          type="date"
          name="date"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Start Time</span>
          </label>
          <input
            type="time"
            name="startTime"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">End Time</span>
          </label>
          <input
            type="time"
            name="endTime"
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Members</span>
        </label>
        <input
          type="text"
          name="members"
          placeholder="e.g. All members"
          className="input input-bordered w-full"
          defaultValue="All members"
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button type="button" className="btn btn-outline flex-1" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn flex-1 text-white font-bold"
          style={{ background: "#6C63FF" }}
        >
          Add Schedule
        </button>
      </div>
    </form>
  );
}