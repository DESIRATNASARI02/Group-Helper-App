import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

// GET /api/groups/:id
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

        const group = await Group.findOne({
            _id: id,
            ownerId: user.id,
        });

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

// PUT /api/groups/:id
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

        const { name, description } = body;

        const group = await Group.findOneAndUpdate(
            {
                _id: id,
                ownerId: user.id,
            },
            {
                name,
                description,
            },
            {
                new: true,
            },
        );

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: "Group updated successfully",
            group,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

// DELETE /api/groups/:id
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

        const group = await Group.findOneAndDelete({
            _id: id,
            ownerId: user.id,
        });

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: "Group deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
