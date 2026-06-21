import { Schema, model, models } from "mongoose";

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        topic: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    },
);

export default models.Group || model("Group", GroupSchema);
