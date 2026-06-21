import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
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

        status: {
            type: String,
            enum: ["pending", "in_progress", "completed"],
            default: "pending",
        },

        deadline: {
            type: Date,
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

export default models.Task || model("Task", TaskSchema);
