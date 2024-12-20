import React from "react";
import { formatDateTime } from '@/utils/datetime';
import { ChatMessage } from '@/apis/message'
interface BotMessageProps {
  message: ChatMessage;
  mapOfMessagesWithId: Map<string, string>;
}

export const BotMessage: React.FC<BotMessageProps> = ({ mapOfMessagesWithId, message }) => {
  let buildMessage = message.message || "";
  if (message.message_id) {
    buildMessage = mapOfMessagesWithId.get(message.message_id || "") || "";
  }

  return (
    <div className="flex items-start max-w-[80%]">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-white">
        {buildMessage}<br></br>
        <span className="text-sm font-semibold">{formatDateTime(message.created_at)}</span>
      </div>
    </div>
  );
};
