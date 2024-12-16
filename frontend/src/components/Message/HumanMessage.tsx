import React from "react";
import { ChatMessage } from '@/apis/message'
import { formatDateTime } from '@/utils/datetime';

interface HumanMessageProps {
  message: ChatMessage;
}

export const HumanMessage: React.FC<HumanMessageProps> = ({ message }) => {
  return (
    <div className="flex items-start max-w-[80%] ml-auto">
      <div className="bg-blue-500 text-white rounded-lg p-3">
        {message.message}
        <br></br>
        <span className="text-sm font-semibold">{formatDateTime(message.created_at)}</span>
      </div>
    </div>
  );
};
