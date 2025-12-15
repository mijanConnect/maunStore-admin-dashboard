"use client";

import FAQModal from "@/components/dashboard/faq-modal";
import Spinner from "@/components/spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteFAQMutation,
  useGetFAQsQuery,
} from "@/lib/redux/apiSlice/faqApi";
import { FAQ } from "@/types";
import { Edit, Plus, Search, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: faqsData, isLoading } = useGetFAQsQuery({
    page: currentPage,
    limit: 10,
  });
  const [deleteFAQ] = useDeleteFAQMutation();

  const faqs = faqsData?.data?.data || [];
  const meta = faqsData?.data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleAddClick = () => {
    setEditingFAQ(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditClick = (faq: FAQ) => {
    setEditingFAQ(faq);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewClick = (faq: FAQ) => {
    setEditingFAQ(faq);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFAQ({ id }).unwrap();
        toast.success("FAQ deleted successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete FAQ");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFAQ(null);
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-gray-600">
            Manage your frequently asked questions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ List</CardTitle>
          <div className="mt-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No FAQs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFAQs.map((faq) => (
                    <TableRow key={faq._id}>
                      <TableCell className="max-w-xs truncate">
                        {faq.question}
                      </TableCell>
                      <TableCell>{faq.category || "General"}</TableCell>
                      <TableCell>
                        <Badge variant={faq.isActive ? "default" : "secondary"}>
                          {faq.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewClick(faq)}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEditClick(faq)}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(faq._id)}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {meta.page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage(Math.min(meta.totalPage, currentPage + 1))
            }
            disabled={currentPage === meta.totalPage}
          >
            Next
          </Button>
        </div>
      )}

      <FAQModal
        isOpen={showModal}
        onClose={handleCloseModal}
        item={editingFAQ}
        mode={modalMode}
      />
    </div>
  );
}
