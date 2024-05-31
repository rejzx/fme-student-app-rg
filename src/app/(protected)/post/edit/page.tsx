import { getPostByStudentId } from "@/src/app/data/studentPost";
import { auth } from "@/src/auth";
import EditStudentPostForm from "@/src/components/studentPost/EditStudentPostForm";

const StudentPost = async () => {
  const session = await auth();
  const studentId = session?.user?.id;
  const studentPost = studentId ? await getPostByStudentId(studentId) : null;

  return (
    <div>
      <EditStudentPostForm studentPost={studentPost} />
    </div>
  )
}

export default StudentPost;