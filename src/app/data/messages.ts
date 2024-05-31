'use server';

import db from "@/src/lib/db";
import { MessageSchema } from "@/src/schemas";

export const getAllMessagesForStudent = async (studentId: string) => {
  try {
    const messages = await db.message.findMany({
      where: { toStudentId: studentId },
      include: {
        company: true,
        post: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Validate messages with Zod
    const validatedMessages = MessageSchema.array().parse(messages);

    return validatedMessages;
  } catch (error) {
    console.error('Error fetching messages for student:', error);
    return null;
  }
};

export const getMessageById = async (messageId: string) => {
  try {
    const message = await db.message.findUnique({
      where: { id: messageId },
      include: {
        company: true,
        post: true,
      },
    });

    // Validate message with Zod
    const validatedMessage = MessageSchema.parse(message);

    return validatedMessage;
  } catch (error) {
    console.error('Error fetching message by ID:', error);
    return null;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const message = await db.message.update({
      where: { id: messageId },
      data: { viewed: true },
    });
    return message;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return null;
  }
};
