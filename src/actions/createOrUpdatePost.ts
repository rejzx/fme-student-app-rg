'use server';

import * as z from "zod";
import { EducationSchema, SkillSchema, StudentPostSchema } from "@/src/schemas";
import db from "@/src/lib/db";
import { auth } from "@/src/auth";

// Function to create or update a post
export const createOrUpdatePost = async (values: z.infer<typeof StudentPostSchema>) => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized: No valid session found" };
  }

  const studentId = session.user.id;
  const validatedFields = StudentPostSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid post data!" };
  }

  const { content, isActive, id, education, workExperiences, skills } = validatedFields.data;

  // Prepare work education data for database operation
  const educationData = education?.map(educationEntry => ({
    degree: educationEntry.degree,
    institution: educationEntry.institution,
    yearOfGraduation: educationEntry.yearOfGraduation
  }));

  // Prepare work experiences data for database operation
  const workExperiencesData = workExperiences?.map(workExp => ({
    company: workExp.company,
    position: workExp.position,
    location: workExp.location,
    startDate: workExp.startDate,
    endDate: workExp.endDate,
  }));

  // Prepare skills data for database operation
  const skillsData = skills?.map(skillsEntry => ({
    skillName: skillsEntry.skillName,
    level: skillsEntry.level
  }));

  // Check if a post exists and update or create based on this
  const existingPost = id ? await db.post.findUnique({ where: { id: id, studentId: studentId } }) : null;

  try {
    if (existingPost) {
      // Update the existing post
      const updatedPost = await db.post.update({
        where: { id: existingPost.id },
        data: { 
          content, 
          isActive, 
          education: {
            deleteMany: {}, // Deletes all existing work experiences before creating new ones
            createMany: {
              data: educationData || [], // Safely handles potentially undefined education
            }
          },
          workExperiences: {
            deleteMany: {}, // Deletes all existing work experiences before creating new ones
            createMany: {
              data: workExperiencesData || [], // Safely handles potentially undefined workExperiences
            }
          },
          skills: {
            deleteMany: {}, // Deletes all existing work experiences before creating new ones
            createMany: {
              data: skillsData || [], // Safely handles potentially undefined skills
            }
          },
        },
        include: { workExperiences: true, education: true, skills: true },
      });
      return { success: "Post updated successfully!", post: updatedPost };
    } else {
      // Create a new post
      const newPost = await db.post.create({
        data: {
          content,
          isActive,
          studentId: studentId,
          education: {
            createMany: {
              data: educationData || [], // Safely handles potentially undefined education
            }
          },
          workExperiences: {
            createMany: {
              data: workExperiencesData || [], // Safely handles potentially undefined workExperiences
            }
          },
          skills: {
            createMany: {
              data: skillsData || [], // Safely handles potentially undefined skills
            }
          }
        },
        include: { workExperiences: true, education: true, skills: true },
      });
      return { success: "Post created successfully!", post: newPost };
    }
  } catch (error) {
    console.error("Failed to create or update post:", error);
    return { error: "Failed to create or update the post due to a server error." };
  }
};
