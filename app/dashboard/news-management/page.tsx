"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { News } from "@/types";
import { NewsModal } from "@/components/dashboard/news-modal";
import Image from "next/image";
import {
  useGetNewsQuery,
  useDeleteNewsMutation,
} from "@/lib/redux/apiSlice/newsApi";
import { getImageUrl } from "@/components/dashboard/imageUrl";
import Spinner from "@/components/spinner/Spinner";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading } = useGetNewsQuery({ page, limit });
  const [deleteNews] = useDeleteNewsMutation();

  const news = data?.data?.data || [];
  const meta = data?.data?.meta ?? { page: 1, limit, total: 0, totalPage: 1 };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      await deleteNews({ id }).unwrap();
    }
  };

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingNews(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (newsItem: News) => {
    setEditingNews(newsItem);
    setModalMode("view");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingNews(null);
  };

  // Function to strip HTML tags for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
  };

  if (isLoading) return <Spinner />;
  // if (error) return <p>Error loading news.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            News Management{" "}
            <span className="text-primary">({meta.total ?? 0})</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your news articles and announcements.
          </p>
        </div>
      </div>

      <NewsModal
        isOpen={showModal}
        onClose={handleModalClose}
        news={editingNews}
        mode={modalMode}
      />

      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add News
        </Button>
      </div>

      <Card>
        <CardContent>
          {filteredNews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-lg font-medium mb-2">No news found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first news article."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add News
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Updated Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((newsItem: News, index: number) => (
                    <TableRow key={newsItem._id || index}>
                      <TableCell>
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {newsItem.image ? (
                            <Image
                              src={getImageUrl(newsItem.image)}
                              alt={newsItem.title}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📰
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium max-w-[200px] truncate">
                          {newsItem.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate text-sm text-muted-foreground">
                          {newsItem.description
                            ? stripHtml(newsItem.description).substring(
                                0,
                                100
                              ) + "..."
                            : "No description"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(newsItem.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(newsItem.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(newsItem)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(newsItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(newsItem._id)}
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
