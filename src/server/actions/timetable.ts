"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asPlainArray } from "@/lib/server/serializers";

const TimetableEntrySchema = z.object({
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  roomNumber: z.string().optional(),
});

export type TimetableFormData = z.infer<typeof TimetableEntrySchema>;

type ActionResult<T = void> =
  | { success: true; data?: T; error?: never }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      data?: never;
    };

async function getAuthContext() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; institutionId?: string; role?: string }
    | undefined;

  if (!user?.id || !user.institutionId || !user.role) {
    throw new Error("Unauthorized");
  }
  return {
    userId: user.id,
    institutionId: user.institutionId,
    role: user.role,
  };
}

function toWeeklySchedule(
  entries: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    subject: { id: string; name: string; code: string };
    teacher: { id: string; firstName: string; lastName: string };
    class: { id: string; name: string; grade: string; section: string };
  }>,
) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days.map((day, index) => ({
    day,
    dayIndex: index,
    entries: entries
      .filter((entry) => entry.dayOfWeek === index)
      .map((entry) => ({
        id: entry.id,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        roomNumber: null,
        subject: {
          id: entry.subject.id,
          name: entry.subject.name,
          code: entry.subject.code,
        },
        teacher: {
          id: entry.teacher.id,
          firstName: entry.teacher.firstName,
          lastName: entry.teacher.lastName,
        },
        class: {
          id: entry.class.id,
          name: entry.class.name,
          grade: entry.class.grade,
          section: entry.class.section,
        },
      })),
  }));
}

export async function createTimetableEntry(
  formData: TimetableFormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { institutionId, userId, role } = await getAuthContext();

    if (!["SUPER_ADMIN", "ADMIN", "PRINCIPAL"].includes(role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const parsed = TimetableEntrySchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;

    const [classroom, subject, teacher] = await Promise.all([
      db.class.findFirst({ where: { id: data.classId, institutionId } }),
      db.subject.findFirst({ where: { id: data.subjectId, institutionId } }),
      db.teacher.findFirst({ where: { id: data.teacherId, institutionId } }),
    ]);

    if (!classroom) return { success: false, error: "Class not found" };
    if (!subject) return { success: false, error: "Subject not found" };
    if (!teacher) return { success: false, error: "Teacher not found" };

    const hasConflict = await db.timetable.findFirst({
      where: {
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        OR: [
          {
            AND: [
              { startTime: { lte: data.startTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gte: data.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: data.startTime } },
              { endTime: { lte: data.endTime } },
            ],
          },
        ],
      },
    });

    if (hasConflict) {
      return {
        success: false,
        error: "Time slot conflicts with existing timetable entry",
      };
    }

    const entry = await db.$transaction(async (tx) => {
      const created = await tx.timetable.create({
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Timetable",
          entityId: created.id,
          newValues: data,
          userId,
        },
      });

      return created;
    });

    revalidatePath("/dashboard/timetable");
    return { success: true, data: { id: entry.id } };
  } catch (error) {
    console.error("[CREATE_TIMETABLE_ENTRY]", error);
    return { success: false, error: "Failed to create timetable entry" };
  }
}

export async function updateTimetableEntry(
  id: string,
  formData: TimetableFormData,
): Promise<ActionResult> {
  try {
    const { institutionId, role, userId } = await getAuthContext();

    if (!["SUPER_ADMIN", "ADMIN", "PRINCIPAL"].includes(role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const parsed = TimetableEntrySchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = parsed.data;

    const [existing, classroom, subject, teacher] = await Promise.all([
      db.timetable.findFirst({
        where: {
          id,
          class: { institutionId },
        },
      }),
      db.class.findFirst({ where: { id: data.classId, institutionId } }),
      db.subject.findFirst({ where: { id: data.subjectId, institutionId } }),
      db.teacher.findFirst({ where: { id: data.teacherId, institutionId } }),
    ]);

    if (!existing) {
      return { success: false, error: "Timetable entry not found" };
    }
    if (!classroom) return { success: false, error: "Class not found" };
    if (!subject) return { success: false, error: "Subject not found" };
    if (!teacher) return { success: false, error: "Teacher not found" };

    await db.$transaction(async (tx) => {
      await tx.timetable.update({
        where: { id },
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Timetable",
          entityId: id,
          oldValues: {
            classId: existing.classId,
            subjectId: existing.subjectId,
            teacherId: existing.teacherId,
            dayOfWeek: existing.dayOfWeek,
            startTime: existing.startTime,
            endTime: existing.endTime,
          },
          newValues: data,
          userId,
        },
      });
    });

    revalidatePath("/dashboard/timetable");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_TIMETABLE_ENTRY]", error);
    return { success: false, error: "Failed to update timetable entry" };
  }
}

export async function deleteTimetableEntry(id: string): Promise<ActionResult> {
  try {
    const { institutionId, role, userId } = await getAuthContext();

    if (!["SUPER_ADMIN", "ADMIN", "PRINCIPAL"].includes(role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const existing = await db.timetable.findFirst({
      where: { id, class: { institutionId } },
    });

    if (!existing) {
      return { success: false, error: "Timetable entry not found" };
    }

    await db.$transaction(async (tx) => {
      await tx.timetable.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          action: "DELETE",
          entity: "Timetable",
          entityId: id,
          userId,
        },
      });
    });

    revalidatePath("/dashboard/timetable");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_TIMETABLE_ENTRY]", error);
    return { success: false, error: "Failed to delete timetable entry" };
  }
}

export async function getTimetableForClass(classId: string) {
  const { institutionId } = await getAuthContext();

  const classroom = await db.class.findFirst({
    where: { id: classId, institutionId },
    select: { id: true },
  });

  if (!classroom) return [];

  const entries = await db.timetable.findMany({
    where: { classId },
    include: {
      subject: { select: { id: true, name: true, code: true } },
      teacher: { select: { id: true, firstName: true, lastName: true } },
      class: { select: { id: true, name: true, grade: true, section: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return asPlainArray(entries).map((entry) => ({
    id: entry.id,
    dayOfWeek: entry.dayOfWeek,
    startTime: entry.startTime,
    endTime: entry.endTime,
    roomNumber: null,
    subject: {
      id: entry.subject.id,
      name: entry.subject.name,
      code: entry.subject.code,
    },
    teacher: {
      id: entry.teacher.id,
      firstName: entry.teacher.firstName,
      lastName: entry.teacher.lastName,
    },
    class: {
      id: entry.class.id,
      name: entry.class.name,
      grade: entry.class.grade,
      section: entry.class.section,
    },
  }));
}

export async function getTimetableForTeacher(teacherId: string) {
  const { institutionId } = await getAuthContext();

  const teacher = await db.teacher.findFirst({
    where: { id: teacherId, institutionId },
    select: { id: true },
  });

  if (!teacher) return [];

  const entries = await db.timetable.findMany({
    where: { teacherId },
    include: {
      subject: { select: { id: true, name: true, code: true } },
      class: { select: { id: true, name: true, grade: true, section: true } },
      teacher: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return asPlainArray(entries).map((entry) => ({
    id: entry.id,
    dayOfWeek: entry.dayOfWeek,
    startTime: entry.startTime,
    endTime: entry.endTime,
    roomNumber: null,
    subject: {
      id: entry.subject.id,
      name: entry.subject.name,
      code: entry.subject.code,
    },
    teacher: {
      id: entry.teacher.id,
      firstName: entry.teacher.firstName,
      lastName: entry.teacher.lastName,
    },
    class: {
      id: entry.class.id,
      name: entry.class.name,
      grade: entry.class.grade,
      section: entry.class.section,
    },
  }));
}

export async function getWeeklyTimetable(classId?: string) {
  const { institutionId } = await getAuthContext();

  const selectedClassId = classId && classId !== "all" ? classId : undefined;

  if (selectedClassId) {
    const classroom = await db.class.findFirst({
      where: { id: selectedClassId, institutionId },
      select: { id: true },
    });

    if (!classroom) {
      return toWeeklySchedule([]);
    }
  }

  const entries = await db.timetable.findMany({
    where: selectedClassId
      ? { classId: selectedClassId }
      : { class: { institutionId } },
    include: {
      subject: { select: { id: true, name: true, code: true } },
      teacher: { select: { id: true, firstName: true, lastName: true } },
      class: { select: { id: true, name: true, grade: true, section: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return toWeeklySchedule(asPlainArray(entries));
}
