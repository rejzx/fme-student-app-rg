'use server';

import db from "@/src/lib/db";
import { auth } from "@/src/auth";

export const markAsRead = async (messageId: string) => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized: No valid session found" };
  }

  try {
    const message = await db.message.update({
      where: { id: messageId },
      data: { viewed: true },
    });
    return { success: true, message };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { error: "Failed to mark the message as read" };
  }
};
