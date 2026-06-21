import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: task.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: task.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const updatedTask = await Task.findByIdAndUpdate(id, body, {
            new: true,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: task.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Task.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
