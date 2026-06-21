import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import Message from "@/models/Message";
import { getCurrentUser } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

        const { groupId } = await req.json();

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

        const messages = await Message.find({
            groupId,
        })
            .populate("senderId", "name")
            .sort({ createdAt: 1 })
            .limit(100);

        if (messages.length === 0) {
            return NextResponse.json({
                summary: "No messages found.",
            });
        }

        const conversation = messages
            .map((msg: any) => {
                const sender = msg.senderId?.name || "Unknown";

                return `${sender}: ${msg.content}`;
            })
            .join("\n");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(`
      Summarize the following study group discussion.

      Include:
      - Main topics discussed
      - Important decisions
      - Action items / tasks

      Discussion:

      ${conversation}
    `);

        const summary = result.response.text();

        return NextResponse.json({
            summary,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            },
        );
    }
}
