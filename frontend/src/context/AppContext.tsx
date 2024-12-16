import { createContext, useContext, useState, ReactNode } from "react";
import { ChatConverstation, ChatMessage } from "@/apis/message";

interface AppContextType {
  setConverstation: (data: ChatConverstation[]) => void;
  setChatMessage: (data: ChatMessage[]) => void;
  setCurrentConverstation: (data: ChatConverstation) => void;
  currentConverstation?: ChatConverstation,
  converstation: ChatConverstation[];
  chatHistory: ChatMessage[];
  isSending: boolean;
  setIsSending: (isSending: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [converstation, setConverstation] = useState<ChatConverstation[]>([]);
  const [chatHistory, setChatMessage] = useState<ChatMessage[]>([]);
  const [currentConverstation, setCurrentConverstation] = useState<ChatConverstation>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const value = {
    currentConverstation,
    setCurrentConverstation,
    converstation,
    setConverstation,
    chatHistory,
    setChatMessage,
    setIsSending,
    isSending
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
