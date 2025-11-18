// lib/redux/features/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: [
    "Products",
    "Users",
    "Orders",
    "Brands",
    "Category",
    "Brand",
    "Categories",
    "News",
    "Profile",
    "Chats",
    "chatId",
    "Messages",
  ],
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.10.7.111:5003/api/v1",
    // baseUrl: "https://api.raconliapp.com/api/v1",
    baseUrl: "http://10.10.7.111:5003/api/v1",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
