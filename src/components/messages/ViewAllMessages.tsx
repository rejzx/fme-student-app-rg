'use client'

import React, { useState } from 'react';
import { markAsRead } from '@/src/actions/markAsRead';
import { MessageSchema } from '@/src/schemas';
import * as z from 'zod';

interface ViewAllMessagesProps {
  messages: z.infer<typeof MessageSchema>[] | null;
}

const ViewAllMessages: React.FC<ViewAllMessagesProps> = ({ messages }) => {
  const [localMessages, setLocalMessages] = useState(messages || []);

  const handleMarkAsRead = async (messageId: string) => {
    const result = await markAsRead(messageId);
    if (result.success) {
      setLocalMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, viewed: true } : message
        )
      );
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      {localMessages && localMessages.length > 0 ? (
        <ul>
          {localMessages.map((message) => (
            <li
              key={message.id}
              style={{ fontWeight: message.viewed ? 'normal' : 'bold' }}
            >
              <div>From: {message.company.name}</div>
              <div>Content: {message.content}</div>
              <div>Post: {message.post.content}</div>
              <div>Received at: {new Date(message.createdAt).toLocaleString()}</div>
              {!message.viewed && (
                <button onClick={() => handleMarkAsRead(message.id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

export default ViewAllMessages;
