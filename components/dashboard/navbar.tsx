"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User } from "lucide-react";
import { socketService } from "@/lib/socket";
import {
  addNotification,
  markAsRead,
  markAllAsRead,
} from "@/lib/redux/features/notificationSlice";
import LogoutButton from "./logoutButton";
import { useGetProfileQuery } from "@/lib/redux/apiSlice/settingsApi";
import Link from "next/link";

export function Navbar() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  // ✅ Fetch logged-in user profile
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  // useEffect(() => {
  //   const socket = socketService.getSocket();
  //   if (socket) {
  //     socket.on("notification", (notification) => {
  //       dispatch(addNotification(notification));
  //     });

  //     return () => {
  //       socket.off("notification");
  //     };
  //   }
  // }, [dispatch]);

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-8 h-full">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 hidden sm:block">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Notifications</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notifications
                  </p>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read ? "bg-gray-50" : "bg-blue-50"
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover> */}

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      profileData?.data?.profileImage
                        ? profileData.data.profileImage.startsWith("http")
                          ? profileData.data.profileImage
                          : `http://10.10.7.111:5000${profileData.data.profileImage}`
                        : undefined
                    }
                    alt={profileData?.data?.name || "User"}
                  />
                  <AvatarFallback>
                    {profileData?.data?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "AD"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">
                  {profileData?.data?.name || "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
