import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export type SessionUser = {
    id: string;
    schoolId: string;
    role: string;
    email: string;
    name: string | null;
};

export function createAuthToken(userId: string) {
    return Buffer.from(`${userId}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`).toString("base64");
}

function decodeToken(token: string): string | null {
    try {
        return Buffer.from(token, "base64").toString("utf-8");
    } catch {
        return null;
    }
}

export function getUserIdFromAuthToken(token: string | undefined): string | null {
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    const [userId, timestamp] = decoded.split(":");
    if (!userId || !timestamp) return null;

    const parsedTimestamp = Number(timestamp);
    if (!Number.isFinite(parsedTimestamp)) return null;

    return userId;
}

export async function getSessionUserFromRequest(req: NextRequest): Promise<SessionUser | null> {
    const token = req.cookies.get("auth_token")?.value;
    const userId = getUserIdFromAuthToken(token);

    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            schoolId: true,
            role: true,
            email: true,
            name: true,
        },
    });

    return user;
}

export function canWriteSchoolData(role: string) {
    return role === "admin";
}

export function canReadSchoolData(role: string) {
    return role === "admin" || role === "teacher";
}
