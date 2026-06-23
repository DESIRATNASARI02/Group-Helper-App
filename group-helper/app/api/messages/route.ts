import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import Message from "@/models/Message";
import { getCurrentUser } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const groupId = req.nextUrl.searchParams.get("groupId");
        if (!groupId) {
            return NextResponse.json({ message: "groupId is required" }, { status: 400 });
        }

        const group = await Group.findOne({ _id: groupId, members: user.id });
        if (!group) {
            return NextResponse.json({ message: "You are not a member of this group" }, { status: 403 });
        }

        const messages = await Message.find({ groupId })
            .populate("senderId", "name email avatarColor")
            .sort({ createdAt: 1 });

        return NextResponse.json(messages);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { groupId, content, isAI } = body; 

        if (!groupId || !content) {
            return NextResponse.json({ message: "groupId and content are required" }, { status: 400 });
        }

        const group = await Group.findOne({ _id: groupId, members: user.id });
        if (!group) {
            return NextResponse.json({ message: "You are not a member of this group" }, { status: 403 });
        }

        const message = await Message.create({
            groupId,
            senderId: user.id,
            content,
            isAI: isAI || false, 
        });

        const populatedMessage = await Message.findById(message._id).populate("senderId", "name email avatarColor");

        await pusher.trigger(`group-${groupId}`, "new-message", populatedMessage);

        return NextResponse.json(
            { message: "Message sent successfully", data: populatedMessage },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}