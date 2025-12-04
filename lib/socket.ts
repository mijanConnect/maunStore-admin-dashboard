
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

type ServerToClientEvents = {
  newMessage: (message: Message) => void;
  newChatSession: () => void;
};

type ClientToServerEvents = {
  sendMessage: (message: { chatId: string; text: string }) => void;
};

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(
        // process.env.NEXT_PUBLIC_SOCKET_URL || "http://10.10.7.111:5000",
        process.env.NEXT_PUBLIC_SOCKET_URL ||
          // "https://moshfiqur5000.binarybards.online",
          "https://api.raconliapp.com",
        {
          autoConnect: true,
        }
      );

      this.socket.on("connect", () => {
        console.log("Socket connected! ID:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    return this.socket;
  }

  getSocket(): Socket {
    if (!this.socket) return this.connect(); // ensure always connected
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(chatId: string, text: string) {
    this.getSocket().emit("sendMessage", { chatId, text });
  }
}

export const socketService = new SocketService();
