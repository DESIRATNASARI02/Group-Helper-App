import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
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

        const groups = await Group.find({
            $or: [{ ownerId: decoded.id }, { members: decoded.id }],
        });

        return NextResponse.json({ groups }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
