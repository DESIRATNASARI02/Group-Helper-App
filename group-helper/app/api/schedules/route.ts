import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
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
        const schedules = await Schedule.find({ groupId })
            .populate("createdBy", "name email")
            .sort({ date: 1, startTime: 1 });
        return NextResponse.json(schedules);
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
        const { groupId, title, description, type, date, startTime, endTime, members, location } = body;

        if (!groupId || !title || !date || !startTime || !endTime) {
            return NextResponse.json(
                { message: "groupId, title, date, startTime, endTime are required" },
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
        const schedule = await Schedule.create({
            groupId,
            title,
            description,
            type,
            date,
            startTime,
            endTime,
            members,
            location,
            createdBy: user.id,
        });
        return NextResponse.json(
            {
                message: "Schedule created successfully",
                schedule,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}