"use client";

import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import Spinner from "@/components/spinner/Spinner";
import { Toaster } from "@/components/ui/sonner";
import { setCredentials } from "@/lib/redux/features/authSlice";
import { RootState } from "@/lib/redux/store";
import { socketService } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication on mount and when auth state changes
    const checkAuth = () => {
      const tokenFromStorage = localStorage.getItem("accessToken");
      const userFromStorage = localStorage.getItem("user");

      // If no token in Redux or localStorage, redirect to login
      if (!isAuthenticated && !tokenFromStorage) {
        router.push("/login");
        return;
      }

      // If token exists in localStorage but not in Redux (page refresh case)
      if (!isAuthenticated && tokenFromStorage && userFromStorage) {
        try {
          const user = JSON.parse(userFromStorage);
          dispatch(setCredentials({ user, token: tokenFromStorage }));
        } catch (error) {
          // Invalid user data in localStorage, redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }
      }

      // Authentication check complete
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, token, router, dispatch, setIsChecking]);

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Checking authentication...</p> */}
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 lg:ml-64 min-h-screen">
        <Navbar />
        <main className="p-4 lg:p-8 mt-16">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
