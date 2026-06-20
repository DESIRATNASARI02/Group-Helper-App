import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

// GET /api/groups
export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const groups = await Group.find({
            ownerId: user.id,
        }).sort({
            createdAt: -1,
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

// POST /api/groups
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

        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { message: "Group name is required" },
                { status: 400 },
            );
        }

        const group = await Group.create({
            name,
            description,
            ownerId: user.id,
        });

        return NextResponse.json(
            {
                message: "Group created successfully",
                group,
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
