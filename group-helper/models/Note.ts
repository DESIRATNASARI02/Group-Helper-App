import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
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

        content: {
            type: String,
            default: "",
        },

        tags: [
            {
                type: String,
            },
        ],

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

export default models.Note || model("Note", NoteSchema);
