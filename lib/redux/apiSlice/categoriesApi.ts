// lib/redux/apiSlice/categoriesApi.ts
import { api } from "../features/baseApi";
import { Category } from "@/types";

export interface CategoriesApiResponse {
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
    data: Category[];
  };
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoriesApiResponse,
      { page?: number; limit?: number } | void
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        // ✅ add = {} here
        url: `/categories?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // New query to fetch all categories without pagination
    getAllCategories: builder.query<CategoriesApiResponse, void>({
      query: () => ({
        url: `/categories?limit=1000`, // assuming 1000 is enough to get all categories
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    addCategory: builder.mutation<
      Category,
      { name: string; description: string; imageFile: File; brandId: string }
    >({
      query: ({ name, description, imageFile, brandId }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", imageFile);
        formData.append("brandId", brandId);

        return {
          url: "/categories",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Category", "Brand", "Categories"],
    }),

    updateCategory: builder.mutation<
      Category,
      {
        _id: string;
        name?: string;
        description?: string;
        imageFile?: File;
        brandId?: string;
      }
    >({
      query: ({ _id, name, description, imageFile, brandId }) => {
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (description) formData.append("description", description);
        if (imageFile) formData.append("image", imageFile);
        if (brandId) formData.append("brandId", brandId);

        return {
          url: `/categories/${_id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Category", "Brand", "Categories"],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery, // ✅ new hook
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
