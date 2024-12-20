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
    refetch: refetchHistoryConverstation,
    isLoading,
    isRefetching,
    isSuccess,
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

  const [mapOfMessagesWithId, setMapOfMessagesWithId] = useState(new Map<string, string>());
  const [selectedExperts, setSelectedExperts] = useState<string[]>(["1"]);

  let refreshMessage: NodeJS.Timeout | null = null

  const {
    isConnected,
    error: socketError,
    sendMessage,
  } = useWebSocket({
    url: `${WEBSOCKET_BASE_URL}/ws/chat`,
    onMessage: (data: ChatMessage) => {
      setIsSending(false);
      
      try {
        
        if (!data.message_id) return;
        if (!mapOfMessagesWithId.has(data.message_id)) {  
          setChatMessage((prev) => [...prev, data]);
        }

        let existingMessages = mapOfMessagesWithId.get(data.message_id)
        if (!existingMessages || existingMessages === "") {
          existingMessages = ''
        }

        existingMessages += data.message
        mapOfMessagesWithId.set(data.message_id, existingMessages)
        setMapOfMessagesWithId(new Map(mapOfMessagesWithId))

        if (refreshMessage) {
          clearTimeout(refreshMessage)
          refreshMessage = null
        }


        if (data.is_stop) {
            refreshMessage = setTimeout(() => {
              refetchHistoryConverstation();
              setIsSending(false);
          }, 1000);
        }

        refetchConverstation();
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

    if (selectedExperts.length <= 0) { 
      alert("Please select at least one expert");
      return;
    }

    const messagePayload: ChatMessage = {
      message,
      created_at: new Date(),
      experts: selectedExperts.join(","),
      role: "human",
      converstation_id: currentConverstation.converstation_id,
    };

    setIsSending(true);
    sendMessage(messagePayload);
    refetchHistoryConverstation();
  };

  useEffect(() => {
    if (isRefetching) {
      console.log("Refetching...");
    }

    if (isSuccess && !isRefetching) {
      setChatMessage(historyConverstation?.data);
    }
    
  }, [isRefetching, isSuccess]);

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

  console.log("chatHistory", mapOfMessagesWithId);
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
                    <BotMessage mapOfMessagesWithId={mapOfMessagesWithId} message={msg} />
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
