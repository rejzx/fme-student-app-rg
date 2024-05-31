import { auth } from "@/src/auth";
import { getAllMessagesForStudent } from "../../data/messages";
import ViewAllMessages from "@/src/components/messages/ViewAllMessages";

const Messages = async () => {
  const session = await auth();
  const studentId = session?.user?.id;
  const allMessages = studentId ? await getAllMessagesForStudent(studentId) : null;

  return (
    <div>
      <ViewAllMessages messages={allMessages} />
    </div>
  )
}

export default Messages;