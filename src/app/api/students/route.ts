import { prisma } from "@/lib/prisma";
import { canReadSchoolData, canWriteSchoolData, getSessionUserFromRequest } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const studentPayloadSchema = z.object({
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    admissionNo: z.string().trim().min(3),
    rollNo: z.string().trim().optional(),
    classId: z.string().trim().min(1),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string().min(1),
    phone: z.string().trim().optional(),
    email: z.string().trim().email().optional().or(z.literal("")),
    guardianName: z.string().trim().min(2),
    guardianPhone: z.string().trim().min(5),
    guardianRelation: z.string().trim().min(2),
});

export async function POST(req: NextRequest) {
    const sessionUser = await getSessionUserFromRequest(req);
    if (!sessionUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canWriteSchoolData(sessionUser.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const parsedPayload = studentPayloadSchema.safeParse(body);

        if (!parsedPayload.success) {
            return NextResponse.json(
                { error: parsedPayload.error.issues[0]?.message ?? "Invalid student payload" },
                { status: 400 }
            );
        }

        const {
            firstName,
            lastName,
            admissionNo,
            rollNo,
            classId,
            gender,
            dateOfBirth,
            phone,
            email,
            guardianName,
            guardianPhone,
            guardianRelation,
        } = parsedPayload.data;

        const result = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash("student123", 12);
            const normalizedEmail = email?.trim().toLowerCase();

            await tx.user.create({
                data: {
                    email: normalizedEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@eskooly.com`,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                    role: "student",
                    schoolId: sessionUser.schoolId,
                },
            });

            const student = await tx.student.create({
                data: {
                    firstName,
                    lastName,
                    admissionNo,
                    rollNo,
                    classId,
                    gender,
                    dateOfBirth: new Date(dateOfBirth),
                    phone: phone || null,
                    email: normalizedEmail || null,
                    guardianName,
                    guardianPhone,
                    guardianRelation,
                    schoolId: sessionUser.schoolId,
                    status: "active",
                },
            });

            return student;
        });

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "Student admission number, roll number, or email already exists" },
                { status: 409 }
            );
        }

        console.error("[STUDENTS_POST]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const sessionUser = await getSessionUserFromRequest(req);
    if (!sessionUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canReadSchoolData(sessionUser.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const students = await prisma.student.findMany({
            where: {
                schoolId: sessionUser.schoolId,
            },
            include: {
                class: true,
            },
            orderBy: {
                admissionDate: "desc",
            },
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error("[STUDENTS_GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
