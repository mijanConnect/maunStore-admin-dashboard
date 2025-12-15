// lib/redux/apiSlice/faqApi.ts
import { api } from "../features/baseApi";
import { FAQ } from "@/types";

export interface FAQApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: FAQ[];
  };
}

export interface FAQPayload {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<
      FAQApiResponse,
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/faq?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["FAQ"],
    }),

    createFAQ: builder.mutation<{ success: boolean; data: FAQ }, FAQPayload>({
      query: (payload) => ({
        url: "/faq",
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
        url: `/faq/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["FAQ"],
    }),

    deleteFAQ: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/faq/${id}`,
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
