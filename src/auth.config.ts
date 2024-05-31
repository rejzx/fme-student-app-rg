import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/src/schemas";
import { getStudentByEmail } from "@/src/app/data/student";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const student = await getStudentByEmail(email);

          if (!student || !student.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            student.password,
          );

          if (passwordsMatch) return student;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig