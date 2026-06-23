import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import Group from "@/models/Group";
import { pusher } from "@/lib/pusher";

export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const reminders = await Reminder.find({
            isSent: false,
            remindAt: { $lte: now },
        });

        for (const reminder of reminders) {

            await pusher.trigger(`group-${reminder.groupId}`, "reminder", {
                id: reminder._id,
                title: reminder.title,
                description: reminder.description,
                remindAt: reminder.remindAt,
            });

            const group = await Group.findById(reminder.groupId).populate<{
                members: { _id: string; name: string; email: string }[];
            }>("members", "name email");

            if (group && group.members.length > 0) {
                // Email reminder feature disabled
                // Future implementation using email service
            }

            // mark as sent
            await Reminder.findByIdAndUpdate(
                reminder._id,
                { isSent: true }
            );
        }

        return NextResponse.json({
            success: true,
            processed: reminders.length,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}