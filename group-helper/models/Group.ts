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
<<<<<<< HEAD
        topic: {
            type: String,
            default: "",
        },
=======

>>>>>>> origin/main
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
<<<<<<< HEAD
=======

>>>>>>> origin/main
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
<<<<<<< HEAD
        isPublic: {
            type: Boolean,
            default: true,
        },
=======
>>>>>>> origin/main
    },
    {
        timestamps: true,
    },
);

<<<<<<< HEAD
const Group = models.Group || model("Group", GroupSchema);

export default Group;
=======
export default models.Group || model("Group", GroupSchema);
>>>>>>> origin/main
