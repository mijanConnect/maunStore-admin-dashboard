"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { UserModal } from "@/components/dashboard/user-modal";
import { User } from "@/types";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from "@/lib/redux/apiSlice/usersApi";
import { getImageUrl } from "@/components/dashboard/imageUrl";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [page, setPage] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const { data, error, isLoading } = useGetUsersQuery({ page, limit });
  const users = data?.data?.data || [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: limit,
    total: 0,
    totalPage: 1,
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users</p>;

  const handleStatusToggle = async (
    id: string,
    newStatus: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      await updateUserStatus({ id, status: newStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredUsers = users.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (user: User) => {
    setEditingUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser({ id }).unwrap();
        alert("User deleted successfully!");
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user!");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <UserModal
        isOpen={showModal}
        onClose={handleModalClose}
        user={editingUser}
        mode={modalMode}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Management{" "}
          <span className="text-primary">({meta.total ?? 0})</span>
        </h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* <Button onClick={handleAdd}>Add User</Button> */}
      </div>

      <Card>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first user."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: User) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getImageUrl(user.profileImage)}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user._id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ADMIN" ? "default" : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              user.status === "ACTIVE"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {user.status === "ACTIVE" ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={user.status === "ACTIVE"}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(
                                user._id,
                                checked ? "ACTIVE" : "INACTIVE"
                              )
                            }
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta.totalPage > 1 && (
                <div className="flex justify-end items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === meta.totalPage}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, meta.totalPage))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
