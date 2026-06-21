import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";
import { getCurrentUser } from "@/lib/auth";

// GET /api/groups
// GET /api/groups?search=mongodb
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const search = req.nextUrl.searchParams.get("search") || "";

        const filter = search
            ? {
                  $or: [
                      {
                          name: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          topic: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                  ],
              }
            : {};

        const groups = await Group.find(filter)
            .populate("ownerId", "name email")
            .lean();

        const result = groups.map((group: any) => ({
            ...group,
            memberCount: group.members?.length || 0,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            },
        );
    }
}

// POST /api/groups
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                },
            );
        }

        const body = await req.json();

        const { name, topic, description } = body;

        if (!name || !topic) {
            return NextResponse.json(
                {
                    message: "Name and topic are required",
                },
                {
                    status: 400,
                },
            );
        }

        const group = await Group.create({
            name,
            topic,
            description,
            ownerId: user.id,
            members: [user.id],
        });

        return NextResponse.json(
            {
                message: "Group created successfully",
                group,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            },
        );
    }
}
