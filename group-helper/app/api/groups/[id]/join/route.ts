import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { verifyToken } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }, 
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

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        await connectDB();

        const { id } = await params; // <==
        const group = await Group.findById(id);

        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 },
            );
        }

        if (group.members.includes(decoded.id)) {
            return NextResponse.json(
                { message: "Already a member" },
                { status: 400 },
            );
        }

        group.members.push(decoded.id);
        await group.save();

        return NextResponse.json(
            { message: "Joined successfully", group },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}