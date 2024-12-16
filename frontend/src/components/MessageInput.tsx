import { useState, KeyboardEvent, useCallback } from "react";
import { Spin } from "antd";
import debounce from "lodash/debounce";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export default function MessageInput({
  onSendMessage,
  isSending,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const debouncedSend = useCallback(
    debounce((msg: string) => {
      onSendMessage(msg);
    }, 300),
    [onSendMessage]
  );

  const handleSend = () => {
    if (isSending) return;
    
    if (message.trim()) {
      debouncedSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 pr-16 resize-none"
          rows={1}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
        >
          {isSending && <Spin />}
          {!isSending && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
