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
        // "http://10.10.7.48:5000",
        {
          autoConnect: true,
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          timeout: 20000,
        }
      );

      this.socket.on("connect", () => {
        console.log("Socket connected! ID:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      this.socket.on("connect_error", (err) => {
        console.warn("Socket connection error:", err.message);
        // Silently handle connection errors without crashing
      });

      this.socket.on("reconnect_attempt", (attempt) => {
        console.log(`Socket reconnection attempt ${attempt}`);
      });

      this.socket.on("reconnect_failed", () => {
        console.warn("Socket reconnection failed. Please check your server.");
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
