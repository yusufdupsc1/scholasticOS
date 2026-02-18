import { prisma } from "@/lib/prisma";
import { canReadSchoolData, canWriteSchoolData, getSessionUserFromRequest } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const employeePayloadSchema = z.object({
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    employeeId: z.string().trim().min(3),
    designation: z.string().trim().min(2),
    department: z.string().trim().min(2),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.string().min(1),
    phone: z.string().trim().min(5),
    email: z.string().trim().email(),
    baseSalary: z.coerce.number().positive(),
    joiningDate: z.string().min(1),
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
        const parsedPayload = employeePayloadSchema.safeParse(body);

        if (!parsedPayload.success) {
            return NextResponse.json(
                { error: parsedPayload.error.issues[0]?.message ?? "Invalid employee payload" },
                { status: 400 }
            );
        }

        const {
            firstName,
            lastName,
            employeeId,
            designation,
            department,
            gender,
            dateOfBirth,
            phone,
            email,
            baseSalary,
            joiningDate,
        } = parsedPayload.data;

        const result = await prisma.$transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash("employee123", 12);
            const normalizedEmail = email.toLowerCase();

            await tx.user.create({
                data: {
                    email: normalizedEmail,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                    role: designation.toLowerCase().includes("admin") ? "admin" : "teacher",
                    schoolId: sessionUser.schoolId,
                },
            });

            const employee = await tx.employee.create({
                data: {
                    firstName,
                    lastName,
                    employeeId,
                    designation,
                    department,
                    gender,
                    dateOfBirth: new Date(dateOfBirth),
                    phone,
                    email: normalizedEmail,
                    baseSalary,
                    joiningDate: new Date(joiningDate),
                    schoolId: sessionUser.schoolId,
                    status: "active",
                },
            });

            return employee;
        });

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "Employee ID or email already exists" },
                { status: 409 }
            );
        }

        console.error("[EMPLOYEES_POST]", error);
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
        const employees = await prisma.employee.findMany({
            where: {
                schoolId: sessionUser.schoolId,
            },
            orderBy: {
                firstName: "asc",
            },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("[EMPLOYEES_GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
