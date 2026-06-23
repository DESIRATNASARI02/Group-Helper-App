"use client";

import { useState, useEffect, useCallback } from "react";
import Topbar from "@/components/ui/Topbar";
import Modal from "@/components/ui/Modal";
import KanbanColumn from "@/components/tasks/KanbanColumn";
import { Task, TaskStatus } from "@/components/tasks/TaskCard";
import { useGroup } from "@/lib/context/GroupContext";

const columns = [
    {
        id: "pending" as TaskStatus,
        label: "Pending",
        color: "#888780",
        bg: "#F1EFE820",
    },
    {
        id: "in_progress" as TaskStatus,
        label: "In Progress",
        color: "#EF9F27",
        bg: "#FAEEDA20",
    },
    {
        id: "completed" as TaskStatus,
        label: "Completed",
        color: "#1D9E75",
        bg: "#E1F5EE20",
    },
];

export default function TasksPage() {
    const { activeGroup } = useGroup();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        deadline: "",
    });

    const fetchTasks = useCallback(async () => {
        if (!activeGroup) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ groupId: activeGroup._id });

            if (showOnlyMyTasks) {
                params.set("createdBy", "me");
            }

            const res = await fetch(`/api/tasks?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [activeGroup, showOnlyMyTasks]);

    useEffect(() => {
        if (activeGroup) fetchTasks();
    }, [activeGroup, fetchTasks]);

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter((t) => t.status === status);

    const handleMove = async (taskId: string, newStatus: TaskStatus) => {
        setTasks((prev) =>
            prev.map((t) =>
                t._id === taskId ? { ...t, status: newStatus } : t,
            ),
        );
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (err) {
            console.error(err);
            fetchTasks();
        }
    };

    const handleDelete = async (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        try {
            await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        } catch (err) {
            console.error(err);
            fetchTasks();
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title || !activeGroup) return;
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId: activeGroup._id,
                    title: newTask.title,
                    description: newTask.description,
                    deadline: newTask.deadline || undefined,
                }),
            });
            if (res.ok) {
                fetchTasks();
                setNewTask({ title: "", description: "", deadline: "" });
                setShowModal(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!activeGroup) {
        return (
            <div
                className="p-6 flex flex-col items-center justify-center h-96 gap-4"
                data-theme="night"
            >
                <p className="text-4xl">👥</p>
                <p className="text-white font-medium">
                    No active group selected
                </p>
                <p className="text-base-content/50 text-sm">
                    Select a group from the sidebar to view tasks
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col gap-6" data-theme="night">
            <Topbar
                title="Tasks"
                subtitle={`${activeGroup.name} · ${tasks.length} ${showOnlyMyTasks ? "my " : ""}tasks`}
                actions={
                    <>
                        <label className="flex items-center gap-2 text-sm text-base-content/60">
                            <input
                                type="checkbox"
                                className="toggle toggle-sm"
                                checked={showOnlyMyTasks}
                                onChange={(e) =>
                                    setShowOnlyMyTasks(e.target.checked)
                                }
                                style={{ color: "#6C63FF" }}
                            />
                            My tasks
                        </label>
                        <button
                            className="btn btn-sm text-white font-medium"
                            style={{ background: "#6C63FF" }}
                            onClick={() => setShowModal(true)}
                        >
                            + Add Task
                        </button>
                    </>
                }
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <span
                        className="loading loading-spinner loading-lg"
                        style={{ color: "#6C63FF" }}
                    ></span>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4 overflow-x-auto">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            id={col.id}
                            label={col.label}
                            color={col.color}
                            bg={col.bg}
                            tasks={getTasksByStatus(col.id)}
                            onMove={handleMove}
                            onDelete={handleDelete}
                            onAddTask={() => setShowModal(true)}
                        />
                    ))}
                </div>
            )}

            {/* Modal Add Task */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add New Task"
            >
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-white">Title</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Task title..."
                        className="input input-bordered w-full"
                        value={newTask.title}
                        onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                        }
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-white">
                            Description
                        </span>
                        <span className="label-text-alt text-base-content/40">
                            Optional
                        </span>
                    </label>
                    <textarea
                        placeholder="Task description..."
                        className="textarea textarea-bordered w-full resize-none h-20"
                        value={newTask.description}
                        onChange={(e) =>
                            setNewTask({
                                ...newTask,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-white">Deadline</span>
                        <span className="label-text-alt text-base-content/40">
                            Optional
                        </span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        value={newTask.deadline}
                        onChange={(e) =>
                            setNewTask({ ...newTask, deadline: e.target.value })
                        }
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        className="btn btn-outline flex-1"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn flex-1 text-white font-bold"
                        style={{ background: "#6C63FF" }}
                        onClick={handleAddTask}
                    >
                        Add Task
                    </button>
                </div>
            </Modal>
        </div>
    );
}
