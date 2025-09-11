// productsApi.ts
import { api } from "../features/baseApi";
import { Product } from "@/app/dashboard/products/page";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface ProductsApiResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Product[];
}

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryId: string; // categoryId
  gender: "MALE" | "FEMALE" | "UNISEX";
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
  images: File[]; // uploaded images
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<ProductsApiResponse>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const { page = 1, limit = 10 } = params || {};
        return {
          url: `/products?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    addProduct: builder.mutation<ApiResponse<Product>, ProductPayload>({
      query: (payload) => {
        const formData = new FormData();
        const { images, categoryId, ...rest } = payload;

        // Send category instead of categoryId
        formData.append(
          "data",
          JSON.stringify({
            ...rest,
            category: categoryId,
          })
        );

        images.forEach((file) => formData.append("images", file));

        return {
          url: "/products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { _id: string } & ProductPayload
    >({
      query: ({ _id, images, categoryId, ...rest }) => {
        const formData = new FormData();

        formData.append(
          "data",
          JSON.stringify({
            ...rest,
            category: categoryId,
          })
        );

        images.forEach((file) => formData.append("images", file));

        return {
          url: `/products/${_id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
