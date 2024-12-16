"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/modules/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import { BotMessage, HumanMessage } from "@/components/Message";
import { MessageInputWrapper } from "@/modules/MessageInputWrapper";
import { useChatHistoryByIdQuery, ChatMessage } from "@/apis/message";
import { WEBSOCKET_BASE_URL } from "@/constants/api";
import { useAppContext } from "@/context/AppContext";
import { useWebSocket } from "@/hooks/websocket";
import { useChatHistoryQuery } from "@/apis/message";
import { v4 as uuidv4 } from "uuid";
import { List } from "antd";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: chatConverstation, refetch: refetchConverstation } =
    useChatHistoryQuery();
  const {
    currentConverstation,
    setCurrentConverstation,
    setIsSending,
    setChatMessage,
    chatHistory,
    setConverstation,
  } = useAppContext();
  const {
    data: historyConverstation,
    isLoading,
    error,
  } = useChatHistoryByIdQuery(currentConverstation?.converstation_id || "");

  useEffect(() => {
    setConverstation(chatConverstation?.data || []);
  }, [chatConverstation?.data.length]);

  useEffect(() => {
    if (!currentConverstation) {
      const newConversationId = uuidv4();
      setCurrentConverstation({
        converstation_id: newConversationId,
        summary: "New Conversation",
      });
    }
  }, [currentConverstation, setCurrentConverstation]);

  const {
    isConnected,
    error: socketError,
    sendMessage,
  } = useWebSocket({
    url: `${WEBSOCKET_BASE_URL}/ws/chat`,
    onMessage: (data: ChatMessage[]) => {
      setIsSending(false);
      
      try {
        if (data && data.length > 0) {
          setChatMessage([...data]);
          refetchConverstation();
        }
      } catch (e) {
        console.log("Received:", data);
        console.error(e);
      }
    },
  });

  const handleSendMessage = (message: string) => {
    if (!isConnected) {
      return;
    }

    if (message.trim().length <= 0) {
      return;
    }

    if (!currentConverstation || !currentConverstation.converstation_id) {
      return;
    }

    const messagePayload: ChatMessage = {
      message,
      role: "human",
      converstation_id: currentConverstation.converstation_id,
    };

    setIsSending(true);
    sendMessage(messagePayload);
  };

  useEffect(() => {
    if (historyConverstation?.data && historyConverstation.data?.length > 0) {
      setChatMessage(historyConverstation?.data);
    }
  }, [historyConverstation]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col h-screen">
        <ChatHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div ref={chatContainerRef} className="flex-1 overflow-auto h-full">
            <List
              locale={{
                emptyText: <span className="text-white">No Data</span>,
              }}
              dataSource={chatHistory}
              renderItem={(msg, index) => (
                <List.Item>
                  {msg.role === "bot" ? (
                    <BotMessage message={msg} />
                  ) : (
                    <HumanMessage message={msg} />
                  )}
                </List.Item>
              )}
            />
          </div>
        </div>

        <MessageInputWrapper onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
