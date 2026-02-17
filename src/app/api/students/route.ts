import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
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
        } = body;

        // Multi-Tenancy: In a real multi-tenant app, schoolId would come from the user's session.
        // For this demo, we use the first available school context.
        const school = await prisma.school.findFirst();

        if (!school) {
            return new NextResponse("School context not found", { status: 404 });
        }

        // Atomic Transaction: Create User Account & Student Profile together
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Login User
            const hashedPassword = await bcrypt.hash("student123", 12);
            await tx.user.create({
                data: {
                    email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@eskooly.com`,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                    role: "student",
                    schoolId: school.id,
                }
            });

            // 2. Create Student Profile
            const student = await tx.student.create({
                data: {
                    firstName,
                    lastName,
                    admissionNo,
                    rollNo,
                    classId,
                    gender,
                    dateOfBirth: new Date(dateOfBirth),
                    phone,
                    email,
                    guardianName,
                    guardianPhone,
                    guardianRelation,
                    schoolId: school.id,
                    status: "active",
                },
            });

            return student;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("[STUDENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // Multi-Tenancy: Scoped to School
        const school = await prisma.school.findFirst();
        if (!school) return NextResponse.json([]);

        const students = await prisma.student.findMany({
            where: {
                schoolId: school.id,
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
        return new NextResponse("Internal Error", { status: 500 });
    }
}
