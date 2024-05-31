import db from "@/src/lib/db"

export const getStudentByEmail = async (email: string) => {
  try {
    const student = await db.student.findUnique({ where: { email } });

    return student;
  } catch {
    return null;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const student = await db.student.findUnique({ where: { id } });

    return student;
  } catch {
    return null;
  }
};