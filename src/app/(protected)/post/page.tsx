import { auth } from "@/src/auth";
import { getPostByStudentId } from "@/src/app/data/studentPost";
import ViewStudentPost from "@/src/components/studentPost/ViewStudentPostForm";

const StudentPost = async () => {
  const session = await auth();
  const studentId = session?.user?.id;
  const studentPost = studentId ? await getPostByStudentId(studentId) : null;

  return (
    <div>
      <ViewStudentPost studentPost={studentPost} />
    </div>
  )
}

export default StudentPost;