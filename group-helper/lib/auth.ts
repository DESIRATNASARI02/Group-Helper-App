import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type JwtPayload = {
    id: string;
    email: string;
    name: string;
};

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return null;
    }
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}
