import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const groupId = req.nextUrl.searchParams.get("groupId");

        if (!groupId) {
            return NextResponse.json(
                { message: "groupId is required" },
                { status: 400 },
            );
        }

        const group = await Group.findOne({
            _id: groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json(
                { message: "You are not a member of this group" },
                { status: 403 },
            );
        }

        const tasks = await Task.find({ groupId })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await req.json();

        const { groupId, title, description, deadline } = body;

        if (!groupId || !title) {
            return NextResponse.json(
                { message: "groupId and title are required" },
                { status: 400 },
            );
        }

        const group = await Group.findOne({
            _id: groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json(
                { message: "You are not a member of this group" },
                { status: 403 },
            );
        }

        const task = await Task.create({
            groupId,
            title,
            description,
            deadline,
            createdBy: user.id,
        });

        return NextResponse.json(
            {
                message: "Task created successfully",
                task,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
