import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma Client (standard mode)
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database with Multi-Tenancy...");

    // Clean existing data in reverse dependency order
    const tables = [
        "ExamResult", "Results", "Exam", "HomeworkSubmission", "Homework", "Timetable",
        "SalaryPayment", "EmployeeAttendance", "FeePayment", "FeeStructure",
        "Attendance", "SubjectClass", "Student", "Employee", "Subject",
        "Class", "AcademicYear", "SchoolSettings", "User", "School"
    ];

    for (const table of tables) {
        try {
            // @ts-ignore
            await prisma[table.charAt(0).toLowerCase() + table.slice(1)].deleteMany();
        } catch (e) { }
    }

    // 1. Create the Master Tenant (School)
    const school = await prisma.school.create({
        data: {
            name: "eSkooly International School",
            alias: "eskooly-dhaka",
        }
    });

    console.log(`🏫 Created School: ${school.name} (${school.id})`);

    // 2. School Settings
    await prisma.schoolSettings.create({
        data: {
            schoolId: school.id,
            schoolName: school.name,
            tagline: "World's No.1 Education Software",
            email: "admin@eskooly.com",
            phone: "+880-1234-567890",
            address: "123 Education Street",
            city: "Dhaka",
            state: "Dhaka Division",
            country: "Bangladesh",
            zipCode: "1205",
            currency: "BDT",
            timezone: "Asia/Dhaka",
        },
    });

    // 3. Admin User
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
        data: {
            schoolId: school.id,
            email: "admin@eskooly.com",
            password: hashedPassword,
            name: "System Administrator",
            role: "admin",
            phone: "+880-1234-567890",
        },
    });

    // 4. Academic Year
    const academicYear = await prisma.academicYear.create({
        data: {
            schoolId: school.id,
            name: "2025-2026",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-12-31"),
            isCurrent: true,
        },
    });

    // 5. Subjects
    const subjectsData = [
        { name: "Mathematics", code: "MATH101", type: "theory" },
        { name: "English", code: "ENG101", type: "theory" },
        { name: "Science", code: "SCI101", type: "both" },
        { name: "Social Studies", code: "SS101", type: "theory" },
        { name: "Bengali", code: "BEN101", type: "theory" },
        { name: "Computer Science", code: "CS101", type: "practical" },
        { name: "Physics", code: "PHY101", type: "both" },
        { name: "Chemistry", code: "CHE101", type: "both" },
        { name: "Biology", code: "BIO101", type: "both" },
        { name: "History", code: "HIS101", type: "theory" },
        { name: "Geography", code: "GEO101", type: "theory" },
        { name: "Art & Craft", code: "ART101", type: "practical" },
    ];

    const subjects: any[] = [];
    for (const s of subjectsData) {
        const subject = await prisma.subject.create({
            data: { ...s, schoolId: school.id }
        });
        subjects.push(subject);
    }

    // 6. Classes
    const classNames = [
        "Class Nursery", "Class Play", "Class One", "Class Two", "Class Three",
        "Class Four", "Class Five", "Class Six", "Class Seven", "Class Eight",
        "Class Nine", "Class Ten",
    ];

    const classes: any[] = [];
    for (const name of classNames) {
        const cls = await prisma.class.create({
            data: {
                schoolId: school.id,
                name,
                section: "A",
                capacity: 40,
                academicYearId: academicYear.id,
            },
        });
        classes.push(cls);
    }

    // 7. Employees
    const employeesData = [
        { firstName: "Rafiq", lastName: "Ahmed", designation: "Principal", department: "Administration", gender: "male", baseSalary: 80000 },
        { firstName: "Nasreen", lastName: "Akter", designation: "Vice Principal", department: "Administration", gender: "female", baseSalary: 65000 },
        { firstName: "Kamal", lastName: "Hossain", designation: "Teacher", department: "Academic", gender: "male", baseSalary: 45000 },
        { firstName: "Fatema", lastName: "Begum", designation: "Teacher", department: "Academic", gender: "female", baseSalary: 42000 },
        { firstName: "Jamal", lastName: "Uddin", designation: "Teacher", department: "Academic", gender: "male", baseSalary: 40000 },
        { firstName: "Sabrina", lastName: "Islam", designation: "Teacher", department: "Academic", gender: "female", baseSalary: 43000 },
        { firstName: "Arif", lastName: "Rahman", designation: "Teacher", department: "Academic", gender: "male", baseSalary: 41000 },
        { firstName: "Taslima", lastName: "Khatun", designation: "Teacher", department: "Academic", gender: "female", baseSalary: 44000 },
        { firstName: "Imran", lastName: "Khan", designation: "Teacher", department: "Academic", gender: "male", baseSalary: 39000 },
        { firstName: "Reshma", lastName: "Sultana", designation: "Teacher", department: "Academic", gender: "female", baseSalary: 42000 },
        { firstName: "Sumon", lastName: "Mia", designation: "Teacher", department: "Academic", gender: "male", baseSalary: 38000 },
        { firstName: "Nusrat", lastName: "Jahan", designation: "Teacher", department: "Academic", gender: "female", baseSalary: 40000 },
        // ... (rest of staff)
        { firstName: "Habib", lastName: "Sikder", designation: "Accountant", department: "Accounts", gender: "male", baseSalary: 35000 },
        { firstName: "Rupa", lastName: "Chowdhury", designation: "Librarian", department: "Library", gender: "female", baseSalary: 30000 },
        { firstName: "Belal", lastName: "Haque", designation: "Lab Assistant", department: "Lab", gender: "male", baseSalary: 25000 },
        { firstName: "Shirin", lastName: "Alam", designation: "Clerk", department: "Administration", gender: "female", baseSalary: 22000 },
    ];

    const employees: any[] = [];
    for (let i = 0; i < employeesData.length; i++) {
        const emp = employeesData[i];
        const employee = await prisma.employee.create({
            data: {
                schoolId: school.id,
                employeeId: `EMP${String(i + 1).padStart(4, "0")}`,
                firstName: emp.firstName,
                lastName: emp.lastName,
                designation: emp.designation,
                department: emp.department,
                dateOfBirth: new Date(`198${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`),
                gender: emp.gender,
                phone: `+880-17${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
                email: `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}@eskooly.com`,
                joiningDate: new Date(`202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-01`),
                baseSalary: emp.baseSalary,
                qualification: emp.designation === "Teacher" ? "M.Ed" : "B.A",
                address: "Dhaka, Bangladesh",
                city: "Dhaka",
            },
        });
        employees.push(employee);
    }

    // 8. Assign Class Teachers & Subject Assignments
    const teacherEmployees = employees.filter(e => e.designation === "Teacher");

    // Assign class teachers
    for (let i = 0; i < Math.min(classes.length, teacherEmployees.length); i++) {
        await prisma.class.update({
            where: { id: classes[i].id },
            data: { classTeacherId: teacherEmployees[i].id },
        });
    }

    // Assign subjects to classes
    for (const cls of classes) {
        const numSubjects = Math.min(6, subjects.length);
        for (let i = 0; i < numSubjects; i++) {
            const teacherIdx = i % teacherEmployees.length;
            await prisma.subjectClass.create({
                data: {
                    subjectId: subjects[i].id,
                    classId: cls.id,
                    teacherId: teacherEmployees[teacherIdx].id,
                },
            });
        }
    }

    // 9. Students
    const firstNames = {
        male: ["Abir", "Farhan", "Tanvir", "Sakib", "Mahfuz", "Rakib", "Nasim", "Jubayer", "Shafiq", "Kamrul", "Rifat", "Hasan"],
        female: ["Ayesha", "Farhana", "Nadia", "Sadia", "Lamia", "Tasnia", "Sumaiya", "Raihana", "Mim", "Priya", "Jannatul"],
    };
    const lastNames = ["Ahmed", "Rahman", "Islam", "Hossain", "Khan", "Akter", "Begum", "Mia", "Chowdhury", "Uddin"];

    const students: any[] = [];
    let admissionCounter = 1;

    for (const cls of classes) {
        const numStudents = 8 + Math.floor(Math.random() * 15);
        for (let i = 0; i < numStudents; i++) {
            const gender = Math.random() > 0.5 ? "male" : "female";
            // @ts-ignore
            const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            const student = await prisma.student.create({
                data: {
                    schoolId: school.id,
                    admissionNo: `STU${String(admissionCounter++).padStart(5, "0")}`,
                    rollNo: String(i + 1),
                    firstName,
                    lastName,
                    dateOfBirth: new Date(`20${10 + Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`),
                    gender,
                    bloodGroup: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"][Math.floor(Math.random() * 8)],
                    phone: `+880-18${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
                    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${admissionCounter}@student.eskooly.com`,
                    classId: cls.id,
                    guardianName: `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastName}`,
                    guardianPhone: `+880-19${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
                    guardianRelation: Math.random() > 0.5 ? "Father" : "Mother",
                    address: "Dhaka, Bangladesh",
                    city: "Dhaka",
                    admissionDate: new Date(`2025-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`),
                },
            });
            students.push(student);
        }
    }

    // 10. Fee Structures
    for (const cls of classes) {
        await prisma.feeStructure.create({
            data: {
                schoolId: school.id,
                name: "Tuition Fee",
                amount: 3000 + Math.floor(Math.random() * 2000),
                frequency: "monthly",
                classId: cls.id,
                academicYearId: academicYear.id,
                dueDay: 10,
            },
        });
        await prisma.feeStructure.create({
            data: {
                schoolId: school.id,
                name: "Lab Fee",
                amount: 500,
                frequency: "monthly",
                classId: cls.id,
                academicYearId: academicYear.id,
                dueDay: 10,
            },
        });
    }

    // 11. Attendance
    const today = new Date();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        date.setHours(0, 0, 0, 0);
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        for (const student of students) {
            await prisma.attendance.create({
                data: {
                    studentId: student.id,
                    classId: student.classId,
                    date,
                    status: Math.random() < 0.9 ? "present" : "absent",
                },
            }).catch(() => { });
        }
    }

    // 12. Fee Payments
    const feeStructures = await prisma.feeStructure.findMany();
    // Only process a subset of students for payments to simulate pending fees
    for (const student of students.slice(0, 50)) {
        const fees = feeStructures.filter((f) => f.classId === student.classId);
        for (const fee of fees) {
            await prisma.feePayment.create({
                data: {
                    studentId: student.id,
                    feeStructureId: fee.id,
                    amount: fee.amount,
                    paidAmount: fee.amount,
                    month: 1,
                    year: 2026,
                    status: "paid",
                    paymentDate: new Date(),
                    paymentMethod: "cash",
                    receiptNo: `RCP${Math.floor(Math.random() * 100000)}`,
                },
            });
        }
    }

    // 13. Exams
    const exam = await prisma.exam.create({
        data: {
            name: "Mid Term",
            type: "term",
            classId: classes[2].id, // Class One
            academicYearId: academicYear.id,
            startDate: new Date("2025-06-01"),
            endDate: new Date("2025-06-10"),
        }
    });

    const examinees = students.filter(s => s.classId === classes[2].id);
    for (const student of examinees) {
        for (let i = 0; i < 3; i++) {
            await prisma.examResult.create({
                data: {
                    examId: exam.id,
                    studentId: student.id,
                    subjectId: subjects[i].id,
                    marksObtained: 50 + Math.floor(Math.random() * 50),
                    totalMarks: 100,
                    grade: "A",
                }
            });
        }
    }

    console.log("✅ Database seeded successfully with Multi-Tenant Architecture!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
