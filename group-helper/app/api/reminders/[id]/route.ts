import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

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
        const body = await req.json();

        const reminder = await Reminder.findById(id);
        if (!reminder) {
            return NextResponse.json(
                { message: "Reminder not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: reminder.groupId,
            members: user.id,
        });
        if (!group) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 },
            );
        }

        const updatedReminder = await Reminder.findByIdAndUpdate(
            id,
            body,
            { new: true },
        );

        return NextResponse.json(updatedReminder);
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

        const reminder = await Reminder.findById(id);
        if (!reminder) {
            return NextResponse.json(
                { message: "Reminder not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: reminder.groupId,
            members: user.id,
        });
        if (!group) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 },
            );
        }

        await Reminder.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Reminder deleted successfully" },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}