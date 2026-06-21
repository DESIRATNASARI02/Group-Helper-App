import { Schema, model, models } from "mongoose";

const ReminderSchema = new Schema(
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

        remindAt: {
            type: Date,
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default models.Reminder || model("Reminder", ReminderSchema);
