"use client";

interface ReminderFormProps {
  onAdd: (reminder: {
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "low" | "medium" | "high";
  }) => void;
  onClose: () => void;
}

export default function ReminderForm({ onAdd, onClose }: ReminderFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    onAdd({
      title: data.get("title") as string,
      description: data.get("description") as string,
      dueDate: data.get("dueDate") as string,
      dueTime: data.get("dueTime") as string,
      priority: data.get("priority") as "low" | "medium" | "high",
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
          placeholder="Reminder title..."
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
          placeholder="Additional details..."
          className="input input-bordered w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Date</span>
          </label>
          <input
            type="date"
            name="dueDate"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Time</span>
          </label>
          <input
            type="time"
            name="dueTime"
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-white">Priority</span>
        </label>
  <select name="priority" className="select select-bordered w-full" defaultValue="medium">
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</select>
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
          Add Reminder
        </button>
      </div>
    </form>
  );
}