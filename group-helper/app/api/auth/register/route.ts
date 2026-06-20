import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    message: "Name, email, and password are required",
                },
                {
                    status: 400,
                },
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "Email already registered",
                },
                {
                    status: 400,
                },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                message: "Register success",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
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
