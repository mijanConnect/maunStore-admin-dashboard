"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { logout } from "../../lib/redux/features/authSlice";
import { api } from "../../lib/redux/features/baseApi"; // ✅ import your baseApi

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Clear Redux auth state
    dispatch(logout());

    // 2. Reset RTK Query cache (clears old profile, products, etc.)
    dispatch(api.util.resetApiState());

    // 3. Remove token from cookies
    Cookies.remove("token");

    // 4. Remove token from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("resetToken"); // optional

    // 4. Redirect to login page
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
