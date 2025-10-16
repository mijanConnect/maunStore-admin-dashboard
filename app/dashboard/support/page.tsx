"use client";
export const dynamic = "force-dynamic"; // at the top of page.tsx

import { getImageUrl } from "@/components/dashboard/imageUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/lib/redux/apiSlice/supportApi";
import { socketService } from "@/lib/socket";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  chatId?: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageDate: Date;
  unreadCount: number;
  status: "ACTIVE" | "WAITING" | "CLOSED";
}

export default function SupportPage() {
  const { data, isLoading, isError, refetch } = useGetChatsQuery({
    page: 1,
    limit: 10,
  });

  const [loggedInUser, setLoggedInUser] = useState<{
    _id?: string;
    email?: string;
  }>({});

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  const chatSessions: ChatSession[] =
    data?.data?.chats.map((chat) => ({
      id: chat._id,
      userName:
        (chat.participants[0] as any)?.name ||
        chat.participants[0]?.email.split("@")[0] ||
        "Unknown",
      userEmail: chat.participants[0]?.email || "No Email",
      avatar: (chat.participants[0] as any)?.profileImage || "",
      lastMessage: chat.lastMessage?.text || "No messages yet",
      lastMessageTime: chat.lastMessage
        ? new Date(chat.lastMessage.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : new Date(chat.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      lastMessageDate: chat.lastMessage
        ? new Date(chat.lastMessage.updatedAt)
        : new Date(chat.updatedAt),
      unreadCount: chat.unreadCount || 0,
      status: chat.status?.toUpperCase() as "ACTIVE" | "WAITING" | "CLOSED",
    })) || [];

  const sortedChatSessions = [...chatSessions].sort(
    (a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime()
  );

  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(
    chatSessions.length ? chatSessions[0] : null
  );

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(
    selectedChat?.id || "",
    {
      skip: !selectedChat?.id,
    }
  );

  const [messages, setMessages] = useState<Message[]>([]);

  // Load history whenever chat changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const result = await refetchMessages();
      const history =
        result.data?.data?.messages.map((msg) => ({
          id: msg._id,
          chatId: selectedChat.id,
          senderId: msg.sender._id,
          senderName: msg.sender.name,
          message: msg.text,
          timestamp: msg.createdAt,
          isAdmin: msg.sender._id === loggedInUser._id,
        })) || [];

      const sortMessages = (msgs: Message[]) =>
        [...msgs].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      setMessages(sortMessages(history));
    };

    fetchMessages();
  }, [selectedChat, refetchMessages, loggedInUser._id]);

  const [sendMessageApi, { isLoading: sending }] = useSendMessageMutation();

  const selectedChatRef = useRef<ChatSession | null>(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!loggedInUser._id) return;

    const socket = socketService.connect();
    const eventName = `newMessage::${loggedInUser._id}`;

    const listener = (data: any) => {
      if (!data) {
        console.warn("Received empty payload from socket");
        return;
      }

      const chatId = data.chatId || selectedChatRef.current?.id || "unknown";
      const message = data.message || data;

      const formattedMessage: Message = {
        id: message?._id || Math.random().toString(),
        chatId,
        senderId: message?.sender?._id || "unknown",
        senderName: message?.sender?.name || "Unknown",
        message: message?.text || message || "No text",
        timestamp: message?.createdAt || new Date().toISOString(),
        isAdmin: message?.sender?._id === loggedInUser._id,
      };

      // ✅ HERE (Step 2)
      if (selectedChatRef.current && chatId === selectedChatRef.current.id) {
        // If user is already inside this chat → show message + mark as read
        setMessages((prev) => [...prev, formattedMessage]);

        // Optionally call backend to clear unread
        // await api.markAsRead(chatId);
      } else {
        // Otherwise let the unread count update from server
        refetch();
      }
    };

    socket.on(eventName, listener);

    return () => {
      socket.off(eventName, listener);
      socketService.disconnect();
    };
  }, [loggedInUser._id, refetch]);

  useEffect(() => {
    if (!loggedInUser._id) return;

    const socket = socketService.connect();

    // 🔔 unread count event from server
    const unreadEvent = `unreadCountUpdate::${loggedInUser._id}`;

    const handleUnreadUpdate = (data: {
      chatId: string;
      unreadCount: number;
    }) => {
      setSelectedChat((prev) => {
        // If currently viewing this chat, force unreadCount to 0
        if (prev && prev.id === data.chatId) {
          return { ...prev, unreadCount: 0 };
        }
        return prev;
      });

      // Update the chatSessions state optimistically
      refetch(); // or manually update if you keep local state
    };

    socket.on(unreadEvent, handleUnreadUpdate);

    return () => {
      socket.off(unreadEvent, handleUnreadUpdate);
      socketService.disconnect();
    };
  }, [loggedInUser._id, refetch]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageToSend = newMessage;
    setNewMessage(""); // clear input

    try {
      // Optimistic UI
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          chatId: selectedChat.id,
          senderId: loggedInUser._id || "",
          senderName: loggedInUser.email || "Me",
          message: messageToSend,
          timestamp: new Date().toISOString(),
          isAdmin: true,
        },
      ]);

      // Send via API
      const formData = new FormData();
      formData.append("data", JSON.stringify({ text: messageToSend }));

      const newMsg = await sendMessageApi({
        chatId: selectedChat.id,
        body: formData,
      }).unwrap();

      // Emit via socket with chatId
      socketService.getSocket()?.emit("sendMessage", {
        chatId: selectedChat.id,
        text: newMsg.text,
      });

      // Update selected chat lastMessage
      setSelectedChat((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: newMsg.text,
              lastMessageTime: new Date(newMsg.createdAt).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              ),
              lastMessageDate: new Date(newMsg.createdAt),
            }
          : prev
      );

      refetch(); // refresh chat list
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 50); // wait for UI to render
    return () => clearTimeout(timeout);
  }, [messages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "WAITING":
        return "bg-yellow-500";
      case "CLOSED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Support Chat Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Chat</h1>
        <p className="text-muted-foreground">
          Manage customer support conversations in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat Sessions List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Conversations</CardTitle>
            <CardDescription>
              {chatSessions.filter((s) => s.status === "ACTIVE").length} active
              chats
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading chats...
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-red-500">
                Failed to load chats
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                {sortedChatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat?.id === session.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedChat(session)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getImageUrl(session.avatar)}
                            alt={session.userName}
                          />
                          <AvatarFallback>
                            {session.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {/* <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                            session.status
                          )}`}
                        /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {session.userName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {session.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-500 truncate">
                            {session.lastMessage}
                          </p>
                          {session.unreadCount > 0 && (
                            <Badge className="text-xs bg-primary text-white">
                              {session.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getImageUrl(selectedChat.avatar)}
                        alt={selectedChat.userName}
                      />
                      <AvatarFallback>
                        {selectedChat.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedChat.userName}</h3>
                      <p className="text-[12px] text-gray-500">
                        {selectedChat.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isAdmin
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isAdmin
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* 👈 sticky bottom */}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={sending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
