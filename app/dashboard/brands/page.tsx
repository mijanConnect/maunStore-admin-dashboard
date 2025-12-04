"use client";

import BrandCategoryModal from "@/components/dashboard/BrandCategoryModal";
import { getImageUrl } from "@/components/dashboard/imageUrl";
import Spinner from "@/components/spinner/Spinner";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteBrandMutation,
  useGetBrandsQuery,
} from "@/lib/redux/apiSlice/brandsApi";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/lib/redux/apiSlice/categoriesApi";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function BrandsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"brands" | "categories">("brands");

  // ✅ Separate pagination states
  const [brandPage, setBrandPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const limit = 10;

  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery({
    page: brandPage,
    limit,
  });
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery({
      page: categoryPage,
      limit,
    });

  // Extract brand & category arrays and their meta
  const brands = brandsData?.data?.data || [];
  const brandsMeta = brandsData?.data?.meta;

  const categories = categoriesData?.data?.data ?? [];

  const categoriesMeta = categoriesData?.data?.meta;

  const [deleteBrand] = useDeleteBrandMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  // if (brandsLoading || categoriesLoading) return <Spinner />;

  const handleAdd = () => {
    setEditingItem(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setEditingItem(item);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const type = activeTab === "brands" ? "brand" : "category";
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "brand") {
        await deleteBrand(id);
      } else {
        await deleteCategory(id);
      }
    }
  };

  const filteredBrands = brands.filter(
    (brand: any) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData =
    activeTab === "brands" ? filteredBrands : filteredCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === "brands" ? "Brand" : "Category"} Management{" "}
            <span className="text-primary">
              {activeTab === "brands"
                ? `(${brandsMeta?.total ?? 0})`
                : `(${categoriesMeta?.total ?? 0})`}
            </span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab === "brands" ? "Brand" : "Category"}
          </Button>
        </div>
      </div>

      <BrandCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={editingItem}
        mode={modalMode}
        type={activeTab === "brands" ? "brand" : "category"}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Brands Tab */}
        <TabsContent value="brands">
          <Card>
            <CardContent>
              {filteredBrands.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium mb-2">No brands found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by adding your first brands."}
                  </p>
                  {!searchTerm && (
                    <div className="mt-4">
                      <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Brand
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand: any) => (
                      <TableRow key={brand._id}>
                        <TableCell>
                          {brand.image ? (
                            <Image
                              src={getImageUrl(brand.image)}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="rounded"
                              key={brand._id}
                            />
                          ) : (
                            "📁"
                          )}
                        </TableCell>
                        <TableCell>{brand.name}</TableCell>
                        <TableCell>
                          <Badge>{brand.totalCategories} categories</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(brand)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(brand._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {(brandsMeta?.totalPage ?? 0) > 1 && (
                <div className="flex justify-end items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={brandPage === 1}
                    onClick={() =>
                      setBrandPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: brandsMeta?.totalPage ?? 0 },
                    (_, i) => i + 1
                  ).map((p) => (
                    <Button
                      key={p}
                      variant={p === brandPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBrandPage(p)}
                    >
                      {p}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={brandPage === (brandsMeta?.totalPage ?? 1)}
                    onClick={() =>
                      setBrandPage((prev) =>
                        Math.min(prev + 1, brandsMeta?.totalPage ?? 1)
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium mb-2">
                    No categories found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by adding your first categories."}
                  </p>
                  {!searchTerm && (
                    <div className="mt-4">
                      <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Brand Image</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(filteredCategories) &&
                      filteredCategories.map((category: any) => (
                        <TableRow key={category._id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{category.brandId?.name}</TableCell>
                          <TableCell>
                            {category.image ? (
                              <Image
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="rounded"
                                key={category._id}
                              />
                            ) : (
                              "📁"
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(category)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}

              {(categoriesMeta?.totalPage ?? 0) > 1 && (
                <div className="flex justify-end items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={categoryPage === 1}
                    onClick={() =>
                      setCategoryPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: categoriesMeta?.totalPage ?? 0 },
                    (_, i) => i + 1
                  ).map((p) => (
                    <Button
                      key={p}
                      variant={p === categoryPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryPage(p)}
                    >
                      {p}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={categoryPage === (categoriesMeta?.totalPage ?? 1)}
                    onClick={() =>
                      setCategoryPage((prev) =>
                        Math.min(prev + 1, categoriesMeta?.totalPage ?? 1)
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
