// lib/redux/features/authApi.ts
import { api } from "./baseApi";
import { setCredentials } from "./authSlice"; // ✅ import authSlice

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/verify-email",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            localStorage.setItem("resetToken", data.data);
          }
        } catch (err) {
          // console.error("OTP verify failed:", err);
        }
      },
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/resend-otp",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/login",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token && data?.user) {
            localStorage.setItem("accessToken", data.token);
            dispatch(
              setCredentials({
                user: data.user,
                token: data.token,
              })
            );
          }
        } catch (err: any) {
          // console.error("Login failed:", err?.data || err);
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        method: "POST",
        url: "/auth/forget-password",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data: { newPassword: string; confirmPassword: string }) => {
        const token = localStorage.getItem("resetToken"); // read dynamically
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: data,
          headers: {
            resettoken: token || "", // backend expects this
          },
        };
      },
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
