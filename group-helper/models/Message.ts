import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        isAI: { 
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default models.Message || model("Message", MessageSchema);