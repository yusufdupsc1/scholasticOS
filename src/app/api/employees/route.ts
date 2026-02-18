import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
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
        } = body;

        // Multi-Tenancy Context
        const school = await prisma.school.findFirst();
        if (!school) {
            return new NextResponse("School context unavailable", { status: 404 });
        }

        // Atomic Transaction: Create User Account & Employee Profile
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Login User
            const hashedPassword = await bcrypt.hash("employee123", 12);
            await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                    role: designation.toLowerCase().includes("admin") ? "admin" : "teacher",
                    schoolId: school.id,
                }
            });

            // 2. Create Employee Profile
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
                    email,
                    baseSalary: parseFloat(baseSalary),
                    joiningDate: new Date(joiningDate),
                    schoolId: school.id,
                    status: "active",
                },
            });

            return employee;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("[EMPLOYEES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(_req: Request) {
    try {
        const school = await prisma.school.findFirst();
        if (!school) return NextResponse.json([]);

        const employees = await prisma.employee.findMany({
            where: {
                schoolId: school.id,
            },
            orderBy: {
                firstName: "asc",
            },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("[EMPLOYEES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
