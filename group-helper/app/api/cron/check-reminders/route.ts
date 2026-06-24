import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import Message from "@/models/Message";
import Group from "@/models/Group";
import { pusher } from "@/lib/pusher";

export async function GET() {
    try {
        await connectDB();

        const now = new Date();
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const reminders = await Reminder.find({
            isSent: false,
            remindAt: {
                $gte: now,
                $lte: oneDayLater,
            },
        });

        for (const reminder of reminders) {
            const group = await Group.findById(reminder.groupId); 
            if (!group) continue;

            // Simpan ke database sebagai message 
            await Message.create({
                groupId: reminder.groupId,
                senderId: reminder.createdBy, 
                content: `🔔 Reminder: **${reminder.title}**\n\n${reminder.description || ""}\n\n📅 Scheduled: ${new Date(reminder.remindAt).toLocaleString("id-ID")}`,
                isAI: true, // 
            });

            // Trigger Pusher
            await pusher.trigger(`group-${reminder.groupId}`, "reminder", {
                id: reminder._id,
                title: reminder.title,
                description: reminder.description,
                remindAt: reminder.remindAt,
            });

            await Reminder.findByIdAndUpdate(reminder._id, { isSent: true });
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