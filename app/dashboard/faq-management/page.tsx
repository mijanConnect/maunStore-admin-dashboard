"use client";

import FAQModal from "@/components/dashboard/faq-modal";
import Spinner from "@/components/spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import { toast } from "sonner";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: faqs = [], isLoading } = useGetFAQsQuery({
    page: currentPage,
    limit: 10,
  });
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQs</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your frequently asked questions
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      {/* FAQ List Card */}
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle>FAQ List</CardTitle>
            <span className="text-sm text-gray-500">
              Total: {faqs.length} FAQs
            </span>
          </div>
          {/* <div className="mt-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by question, answer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div> */}
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base">
                {faqs.length === 0
                  ? "No FAQs created yet"
                  : "No FAQs match your search"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Question</TableHead>
                    <TableHead className="w-1/3">Answer</TableHead>
                    {/* <TableHead className="w-24">Category</TableHead> */}
                    <TableHead className="w-28">Created Date</TableHead>
                    <TableHead className="w-28 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFAQs.map((faq) => (
                    <TableRow key={faq._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium truncate max-w-xs">
                        {faq.question}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 truncate max-w-sm">
                        {faq.answer}
                      </TableCell>
                      {/* <TableCell className="text-sm">
                        {faq.category ? (
                          <Badge variant="outline">{faq.category}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell> */}
                      <TableCell className="text-sm text-gray-500">
                        {faq.createdAt
                          ? new Date(faq.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewClick(faq)}
                            className="inline-flex items-center justify-center p-2 hover:bg-blue-50 rounded-md transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          {/* <button
                            onClick={() => handleEditClick(faq)}
                            className="inline-flex items-center justify-center p-2 hover:bg-green-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button> */}
                          <button
                            onClick={() => handleDeleteClick(faq._id)}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center p-2 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
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

      {/* Modal */}
      <FAQModal
        isOpen={showModal}
        onClose={handleCloseModal}
        item={editingFAQ}
        mode={modalMode}
      />
    </div>
  );
}
