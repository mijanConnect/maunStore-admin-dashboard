"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { socketService } from "@/lib/socket";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-0 lg:ml-64 min-h-screen">
          <Navbar />
          <main className="p-4 lg:p-8 mt-16">{children}</main>
        </div>
        <Toaster />
      </div>
    </Provider>
  );
}
