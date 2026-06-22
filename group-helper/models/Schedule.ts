import { Schema, model, models } from "mongoose";

const ScheduleSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["study", "review", "exam", "meeting"],
            default: "study",
        },
        date: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        members: {
            type: String,
            default: "All members",
        },
        location: {
            type: String,
            default: "",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default models.Schedule || model("Schedule", ScheduleSchema);