import db from "@/src/lib/db";

export const getPostByStudentId = async (studentId: string) => {
  try {
    // Query the Post table directly using studentId and include related WorkExperiences
    const post = await db.post.findUnique({
      where: { studentId: studentId },
      include: {
        education: true,
        workExperiences: true, // Include the related WorkExperience records in the result
        skills: true
        // student: true  // Optionally, include the Student data if needed
      }
    });

    return post;  // This will return the post object along with WorkExperience data if found, or null if no post is associated
  } catch (error) {
    console.error('Error fetching post by student ID:', error);
    return null;
  }
}