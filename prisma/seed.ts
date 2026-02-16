import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "prisma/dev.db" });
const prisma = new PrismaClient({ adapter }) as any;



async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.examResult.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.homeworkSubmission.deleteMany();
    await prisma.homework.deleteMany();
    await prisma.timetable.deleteMany();
    await prisma.feePayment.deleteMany();
    await prisma.feeStructure.deleteMany();
    await prisma.salaryPayment.deleteMany();
    await prisma.employeeAttendance.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.subjectClass.deleteMany();
    await prisma.student.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.class.deleteMany();
    await prisma.academicYear.deleteMany();
    await prisma.schoolSettings.deleteMany();
    await prisma.user.deleteMany();

    // School Settings
    await prisma.schoolSettings.create({
        data: {
            schoolName: "eSkooly International School",
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

    // Academic Year
    const academicYear = await prisma.academicYear.create({
        data: {
            name: "2025-2026",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-12-31"),
            isCurrent: true,
        },
    });

    // Admin User
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
        data: {
            email: "admin@eskooly.com",
            password: hashedPassword,
            name: "System Administrator",
            role: "admin",
            phone: "+880-1234-567890",
        },
    });

    // Subjects
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
        const subject = await prisma.subject.create({ data: s });
        subjects.push(subject);
    }

    // Classes
    const classNames = [
        "Class Nursery",
        "Class Play",
        "Class One",
        "Class Two",
        "Class Three",
        "Class Four",
        "Class Five",
        "Class Six",
        "Class Seven",
        "Class Eight",
        "Class Nine",
        "Class Ten",
    ];

    const classes: any[] = [];
    for (const name of classNames) {
        const cls = await prisma.class.create({
            data: {
                name,
                section: "A",
                capacity: 40,
                academicYearId: academicYear.id,
            },
        });
        classes.push(cls);
    }

    // Employees (Teachers + Staff)
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

    // Assign class teachers
    const teacherEmployees = employees.filter(e => e.designation === "Teacher");
    for (let i = 0; i < Math.min(classes.length, teacherEmployees.length); i++) {
        await prisma.class.update({
            where: { id: classes[i].id },
            data: { classTeacherId: teacherEmployees[i].id },
        });
    }

    // Subject-Class assignments
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

    // Students
    const firstNames = {
        male: ["Abir", "Farhan", "Tanvir", "Sakib", "Mahfuz", "Rakib", "Nasim", "Jubayer", "Shafiq", "Kamrul", "Rifat", "Hasan", "Mehedi", "Fahim", "Nayem", "Saiful", "Rasel", "Limon", "Shahin", "Riaz"],
        female: ["Ayesha", "Farhana", "Nadia", "Sadia", "Lamia", "Tasnia", "Sumaiya", "Raihana", "Mim", "Priya", "Jannatul", "Tania", "Anika", "Ritu", "Sharmin", "Nahid", "Sumona", "Bristy", "Laboni", "Urmila"],
    };
    const lastNames = ["Ahmed", "Rahman", "Islam", "Hossain", "Khan", "Akter", "Begum", "Mia", "Chowdhury", "Uddin", "Sultana", "Khatun", "Sikder", "Ali", "Alam"];

    const students: any[] = [];
    let admissionCounter = 1;

    for (const cls of classes) {
        const numStudents = 8 + Math.floor(Math.random() * 15); // 8-22 students per class
        for (let i = 0; i < numStudents; i++) {
            const gender = Math.random() > 0.5 ? "male" : "female";
            const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

            const student = await prisma.student.create({
                data: {
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

    // Fee Structures
    for (const cls of classes) {
        await prisma.feeStructure.create({
            data: {
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
                name: "Lab Fee",
                amount: 500,
                frequency: "monthly",
                classId: cls.id,
                academicYearId: academicYear.id,
                dueDay: 10,
            },
        });
    }

    // Attendance for today and recent days
    const today = new Date();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        date.setHours(0, 0, 0, 0);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        for (const student of students) {
            const rand = Math.random();
            await prisma.attendance.create({
                data: {
                    studentId: student.id,
                    classId: student.classId,
                    date,
                    status: rand < 0.85 ? "present" : rand < 0.93 ? "absent" : "late",
                },
            }).catch(() => { }); // ignore duplicates
        }

        for (const employee of employees) {
            const rand = Math.random();
            await prisma.employeeAttendance.create({
                data: {
                    employeeId: employee.id,
                    date,
                    status: rand < 0.9 ? "present" : rand < 0.95 ? "absent" : "on_leave",
                    checkIn: "08:00",
                    checkOut: "16:00",
                },
            }).catch(() => { }); // ignore duplicates
        }
    }

    // Fee Payments (some paid, some pending)
    const feeStructures = await prisma.feeStructure.findMany();
    for (const student of students.slice(0, Math.floor(students.length * 0.7))) {
        const fees = feeStructures.filter((f: any) => f.classId === student.classId);
        for (const fee of fees) {
            for (let month = 1; month <= 2; month++) {
                const paid = Math.random() > 0.3;
                await prisma.feePayment.create({
                    data: {
                        studentId: student.id,
                        feeStructureId: fee.id,
                        amount: fee.amount,
                        paidAmount: paid ? fee.amount : 0,
                        month,
                        year: 2026,
                        status: paid ? "paid" : "pending",
                        paymentDate: paid ? new Date(`2026-${String(month).padStart(2, "0")}-${String(Math.floor(Math.random() * 10) + 1).padStart(2, "0")}`) : null,
                        paymentMethod: paid ? (Math.random() > 0.5 ? "cash" : "bank") : null,
                        receiptNo: paid ? `RCP${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}` : null,
                    },
                });
            }
        }
    }

    // Salary payments
    for (const employee of employees) {
        for (let month = 1; month <= 2; month++) {
            const paid = month === 1;
            await prisma.salaryPayment.create({
                data: {
                    employeeId: employee.id,
                    month,
                    year: 2026,
                    baseSalary: employee.baseSalary,
                    allowances: Math.floor(employee.baseSalary * 0.1),
                    deductions: Math.floor(employee.baseSalary * 0.05),
                    netSalary: employee.baseSalary + Math.floor(employee.baseSalary * 0.1) - Math.floor(employee.baseSalary * 0.05),
                    status: paid ? "paid" : "pending",
                    paymentDate: paid ? new Date(`2026-01-28`) : null,
                    paymentMethod: paid ? "bank" : null,
                },
            });
        }
    }

    // Exams
    const midTerm = await prisma.exam.create({
        data: {
            name: "Mid Term Examination",
            type: "term",
            classId: classes[2].id,
            academicYearId: academicYear.id,
            startDate: new Date("2025-04-15"),
            endDate: new Date("2025-04-25"),
        },
    });

    // Exam Results for Class One students
    const classOneStudents = students.filter(s => s.classId === classes[2].id);
    for (const student of classOneStudents) {
        for (let i = 0; i < 4; i++) {
            await prisma.examResult.create({
                data: {
                    examId: midTerm.id,
                    studentId: student.id,
                    subjectId: subjects[i].id,
                    marksObtained: 40 + Math.floor(Math.random() * 60),
                    totalMarks: 100,
                    grade: ["A+", "A", "A-", "B+", "B", "C"][Math.floor(Math.random() * 6)],
                },
            });
        }
    }

    // Timetable for a few classes
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = [
        { start: "08:00", end: "08:45" },
        { start: "08:50", end: "09:35" },
        { start: "09:40", end: "10:25" },
        { start: "10:40", end: "11:25" },
        { start: "11:30", end: "12:15" },
        { start: "13:00", end: "13:45" },
    ];

    for (let ci = 0; ci < 3; ci++) {
        const cls = classes[ci + 2]; // Class One, Two, Three
        for (const day of days) {
            for (let ti = 0; ti < times.length; ti++) {
                const subjIdx = (ci + ti) % Math.min(6, subjects.length);
                const teacherIdx = subjIdx % teacherEmployees.length;
                await prisma.timetable.create({
                    data: {
                        classId: cls.id,
                        subjectId: subjects[subjIdx].id,
                        teacherId: teacherEmployees[teacherIdx].id,
                        day,
                        startTime: times[ti].start,
                        endTime: times[ti].end,
                        room: `Room ${ci + 1}0${ti + 1}`,
                    },
                });
            }
        }
    }

    // Homework
    for (let i = 0; i < 5; i++) {
        const cls = classes[Math.floor(Math.random() * 5) + 2];
        const subjIdx = Math.floor(Math.random() * 4);
        const teacherIdx = subjIdx % teacherEmployees.length;
        await prisma.homework.create({
            data: {
                title: ["Complete Exercise 5.2", "Write an Essay on Climate Change", "Solve Chapter 3 Problems", "Read and Summarize Chapter 7", "Prepare Project Presentation"][i],
                description: "Complete the assignment and submit before the due date.",
                classId: cls.id,
                subjectId: subjects[subjIdx].id,
                teacherId: teacherEmployees[teacherIdx].id,
                dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
            },
        });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`   - ${students.length} students`);
    console.log(`   - ${employees.length} employees`);
    console.log(`   - ${classes.length} classes`);
    console.log(`   - ${subjects.length} subjects`);
    console.log("   - Fee structures, payments, attendance, exams, timetables, homework");
    console.log("\n🔑 Admin Login:");
    console.log("   Email: admin@eskooly.com");
    console.log("   Password: admin123");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
