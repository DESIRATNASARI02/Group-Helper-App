import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    _req: NextRequest,
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

        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return NextResponse.json(
                { message: "Schedule not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: schedule.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(schedule);
    } catch (error) {
        console.error(error);

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

        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return NextResponse.json(
                { message: "Schedule not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: schedule.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const updatedSchedule = await Schedule.findByIdAndUpdate(id, body, {
            new: true,
        });

        return NextResponse.json({
            message: "Schedule updated successfully",
            schedule: updatedSchedule,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _req: NextRequest,
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

        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return NextResponse.json(
                { message: "Schedule not found" },
                { status: 404 },
            );
        }

        const group = await Group.findOne({
            _id: schedule.groupId,
            members: user.id,
        });

        if (!group) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Schedule.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Schedule deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
