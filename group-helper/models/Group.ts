import mongoose, { Schema, model, models } from "mongoose";

const GroupSchema = new Schema(
    {
        name: {
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
    },
    {
        timestamps: true,
    },
);

const Group = models.Group || model("Group", GroupSchema);

export default Group;
