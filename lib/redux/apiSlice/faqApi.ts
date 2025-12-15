// lib/redux/apiSlice/faqApi.ts
import { api } from "../features/baseApi";
import { FAQ } from "@/types";

export interface FAQApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: FAQ[];
}

export interface FAQPayload {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<FAQ[], { page?: number; limit?: number } | void>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/faqs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: any): FAQ[] => {
        // Handle the backend response: { success, message, statusCode, data: [...] }
        return Array.isArray(response?.data) ? response.data : [];
      },
      providesTags: ["FAQ"],
    }),

    createFAQ: builder.mutation<{ success: boolean; data: FAQ }, FAQPayload>({
      query: (payload) => ({
        url: "/faqs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FAQ"],
    }),

    updateFAQ: builder.mutation<
      { success: boolean; data: FAQ },
      { id: string; payload: FAQPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["FAQ"],
    }),

    deleteFAQ: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
