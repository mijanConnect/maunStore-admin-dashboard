import { api } from "../features/baseApi";
import { Brand } from "@/types";

export interface BrandsApiResponse {
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
    data: Brand[];
  };
}

export const brandsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<
      BrandsApiResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/brands?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Brand", "Category"],
    }),

    addBrand: builder.mutation<
      Brand,
      { name: string; description: string; imageFile: File }
    >({
      query: ({ name, description, imageFile }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", imageFile);

        return {
          url: "/brands",
          method: "POST",
          body: formData, // ✅ multipart/form-data
        };
      },
      invalidatesTags: ["Brand", "Category"],
    }),

    updateBrand: builder.mutation<
      Brand,
      { _id: string; name?: string; description?: string; imageFile?: File }
    >({
      query: ({ _id, name, description, imageFile }) => {
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (description) formData.append("description", description);
        if (imageFile) formData.append("image", imageFile);

        return {
          url: `/brands/${_id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Brand", "Category"],
    }),

    deleteBrand: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand", "Brands", "Category", "Products"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
