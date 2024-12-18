import React from "react";
import { formatDateTime } from '@/utils/datetime';
import { ChatMessage } from '@/apis/message'
interface BotMessageProps {
  message?: string;
}

export const BotMessage: React.FC<BotMessageProps> = ({ message = ""}) => {
  return (
    <div className="flex items-start max-w-[80%]">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-white">
        {message}<br></br>
        {/* <span className="text-sm font-semibold">{formatDateTime(message.created_at)}</span> */}
      </div>
    </div>
  );
};
