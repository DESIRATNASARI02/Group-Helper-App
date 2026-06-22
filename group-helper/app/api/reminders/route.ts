import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
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
                {
                    message: "You are not a member of this group",
                },
                {
                    status: 403,
                },
            );
        }

        const reminders = await Reminder.find({
            groupId,
        })
            .populate("createdBy", "name email")
            .sort({ remindAt: 1 });

        return NextResponse.json(reminders);
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

        const { groupId, title, description, remindAt } = body;

        if (!groupId || !title || !remindAt) {
            return NextResponse.json(
                {
                    message: "groupId, title, and remindAt are required",
                },
                {
                    status: 400,
                },
            );
        }

        const group = await Group.findOne({
            _id: groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json(
                {
                    message: "You are not a member of this group",
                },
                {
                    status: 403,
                },
            );
        }

        const reminder = await Reminder.create({
            groupId,
            title,
            description,
            remindAt,
            createdBy: user.id,
        });

        return NextResponse.json(
            {
                message: "Reminder created successfully",
                reminder,
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
