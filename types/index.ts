// types.ts
export interface Brand {
  _id: string;
  name: string;
  description?: string;
  image?: string; // URL from backend after upload
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string; // URL from backend after upload
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
    brandId: string;
    createdAt: string;
    updatedAt: string;
  };
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  // Watch-specific fields
  gender?: string;
  modelNumber?: string;

  movement?: string;
  caseDiameter?: string;
  caseThickness?: string;
  // Optional fields that might not be in API response
  id?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  sizes?: string[];
  colors?: string[];
  modelNo?: string;
  specifications?: Record<string, string>;
}

export interface User {
  profileImage: string | undefined;
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE"; // 👈 add this
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  _id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "waiting" | "closed";
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
