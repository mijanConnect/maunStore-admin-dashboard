// lib/redux/apiSlice/supportApi.ts
import { api } from "../features/baseApi";

// ---------- Interfaces ----------

export interface ChatParticipant {
  _id: string;
  email: string;
}

export interface Chat {
  _id: string;
  participants: ChatParticipant[];
  lastMessage: any | null;
  status: string;
  isDeleted: boolean;
  deletedBy: string[];
  readBy: string[];
  mutedBy: string[];
  pinnedMessages: string[];
  blockedUsers: string[];
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  unreadCount: number;
  isMuted: boolean;
  isBlocked: boolean;
}

export interface ChatsData {
  chats: Chat[];
  unreadChatsCount: number;
  totalUnreadMessages: number;
}

export interface ChatsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ChatsData;
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
  };
}

export interface MessageItem {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  text: string;
  productId?: string | null;
  images: string[];
  read: boolean;
  type: string;
  isDeleted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  reactions: any[];
  __v: number;
}

export interface MessagesData {
  messages: MessageItem[];
  pinnedMessages: MessageItem[];
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: MessagesData;
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
  };
}
export interface ChatParticipant {
  _id: string;
  email: string;
  profileImage?: string; // add this
}

// ---------- Support API Slice ----------

export const supportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<ChatsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => {
        const token = localStorage.getItem("accessToken");
        return {
          url: `/chats?page=${page}&limit=${limit}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
      providesTags: ["Chats"],
    }),

    getMessages: builder.query<MessagesResponse, string>({
      query: (chatId: string) => {
        const token = localStorage.getItem("accessToken");
        return {
          url: `/messages/${chatId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };
      },
      providesTags: (result, error, chatId) => [
        { type: "Chats" as const, id: chatId },
      ],
    }),

    sendMessage: builder.mutation<
      MessageItem,
      { chatId: string; body: FormData }
    >({
      query: ({ chatId, body }) => {
        const token = localStorage.getItem("accessToken");
        return {
          url: `/messages/send-message/${chatId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type — browser will set multipart/form-data
          },
          body,
        };
      },
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Chats", id: chatId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation } =
  supportApi;
