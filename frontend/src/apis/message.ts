import axios from "./config";
import { useQuery } from "@tanstack/react-query";

export type ChatConverstation = {
  summary: string;
  converstation_id: string;
  created_at?: Date;
};

export type ChatMessage = {
  message_id?: string;
  experts?: string;
  is_stop?: boolean;
  message: string;
  role: "human" | "bot";
  converstation_id: string;
  created_at?: Date;
};

export type Experts = {
  name: string;
  id: string;
}
export type Response<T> = {
  data: T;
};

export const useChatHistoryQuery = () => {
  return useQuery({
    queryKey: [`chat-history`],
    queryFn: () =>
      axios.get<null, Response<ChatConverstation[]>>(`/chat/history`, {}),
    meta: {
      hideAppError: false,
      showAppSpin: true,
    },
  });
};


export const useChatHistoryByIdQuery = (conversation_id: string) => {
  return useQuery({
    queryKey: [`history-converstation-${conversation_id}`],
    queryFn: () =>
      axios.get<null, Response<ChatMessage[]>>(`/chat/history/${conversation_id}`, {}),
    meta: {
      hideAppError: false,
      showAppSpin: true,
    },
  });
};

export const useExpertList = () => {
  return useQuery({
    queryKey: [`expert-list`],
    queryFn: () =>
      axios.get<null, Response<Experts[]>>(`/chat/experts`, {}),
    meta: {
      hideAppError: false,
      showAppSpin: true,
    },
  });
}