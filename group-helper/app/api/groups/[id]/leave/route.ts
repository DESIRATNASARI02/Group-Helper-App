import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { verifyToken } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const token = request.headers
            .get("cookie")
            ?.split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const decoded = verifyToken(token) as { id: string };

        await connectDB();

        const group = await Group.findById(params.id);

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 },
            );
        }

        group.members = group.members.filter(
            (id: string) => id.toString() !== decoded.id,
        );
        await group.save();

        return NextResponse.json(
            { message: "Left group successfully" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
