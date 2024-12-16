import { useState } from "react";
import MessageInput from "@/components/MessageInput";
import { useAppContext } from "@/context/AppContext";

interface MessageInputWrapperProps {
  onSendMessage: (message: string) => void;
}

export const MessageInputWrapper = ({ onSendMessage }: MessageInputWrapperProps) => {
  const { isSending } = useAppContext();
  return <MessageInput isSending={isSending} onSendMessage={onSendMessage} />;
};
