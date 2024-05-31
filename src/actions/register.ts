"use server"

import * as z from "zod"
import { RegisterSchema } from "@/src/schemas";
import bcrypt from "bcryptjs";
import db from "@/src/lib/db";
import { getStudentByEmail } from "@/src/app/data/student";

export const studentRegister = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, firstname, surname} = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingStudent = await getStudentByEmail(email);

  if (existingStudent) {
    return { error: "Email already in use"};
  }

  await db.student.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      surname
    }
  });

  return { success: "Student created!" };
};