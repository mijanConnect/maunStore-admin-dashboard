"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ProductModal } from "@/components/dashboard/product-modal";
import Image from "next/image";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/lib/redux/apiSlice/productsApi";
import AddProductModal from "@/components/dashboard/NewProductModal";
import {
  useGetAllCategoriesQuery,
  useGetCategoriesQuery,
} from "@/lib/redux/apiSlice/categoriesApi";
import { getImageUrl } from "@/components/dashboard/imageUrl";
import { useGetBrandsQuery } from "@/lib/redux/apiSlice/brandsApi";
// import { NewProductModal } from "@/components/dashboard/NewProductModal";

// Updated Product interface to match API response
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
    brandId: string;
    createdAt: string;
    updatedAt: string;
  };
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  // Watch-specific fields
  gender?: string;
  modelNumber?: string;
  movement?: string;
  caseDiameter?: string;
  caseThickness?: string;
  // Optional fields
  id?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  sizes?: string[];
  colors?: string[];
  modelNo?: string;
  specifications?: Record<string, string>;
}

// Brand interface
interface Brand {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
}

// API Response interface
interface ProductsApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: Product[];
  };
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");

  const [showNewProductModal, setShowNewProductModal] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10; // items per page
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleNewProductClick = () => {
    setShowNewProductModal(true);
  };

  const handleNewModalClose = () => {
    setShowNewProductModal(false);
  };

  const { data: brandsData } = useGetBrandsQuery({ page: 1, limit: 100 });
  const brands = brandsData?.data?.data || [];

  // Categories query
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const categories = categoriesData?.data?.data ?? [];

  // Products query
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery({ page, limit, search: searchTerm } as {
    page?: number;
    limit?: number;
    search?: string;
  }) as {
    data: ProductsApiResponse | undefined;
    error: any;
    isLoading: boolean;
  };

  const products = productsData?.data?.data || [];

  // Delete mutation
  const [deleteProduct] = useDeleteProductMutation();

  // Handle loading
  if (categoriesLoading || productsLoading) return <p>Loading...</p>;

  // Handle errors
  if (categoriesError) return <p>Error fetching categories</p>;
  if (productsError) return <p>Error fetching products</p>;

  const handleAdd = () => {
    setEditingProduct(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (product: Product) => {
    setEditingProduct(product);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        alert("Product deleted successfully ✅");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete product ❌");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const getBrandName = (brandId?: string) => {
    if (!brandId || !brands) return "Unknown Brand";
    const brand = brands.find(
      (brand) => brand._id === brandId || brand._id === brandId
    );
    return brand?.name || "Unknown Brand";
  };

  const filteredProducts = products.filter(
    (product: Product) =>
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Management{" "}
            <span className="text-primary">
              ({productsData?.data?.meta?.total ?? 0})
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory.
          </p>
        </div>
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={handleModalClose}
        product={editingProduct}
        mode={modalMode}
      />

      {/* <NewProductModal
        isOpen={showNewProductModal}
        onClose={handleNewModalClose}
      /> */}

      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        {/* <Button onClick={handleNewProductClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button> */}
      </div>

      <Card>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first product."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="mb-5">
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={getImageUrl(product.images[0])}
                            alt={product.name || "Product"}
                            height={100}
                            width={100}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            📦
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || "Unknown Category"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${product.price?.toFixed(2)}
                    </TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(product)}
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {(productsData?.data?.meta?.totalPage ?? 0) > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4">
              {/* Previous button */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              {/* Page numbers */}
              {Array.from(
                { length: productsData?.data?.meta?.totalPage ?? 0 },
                (_, i) => i + 1
              ).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}

              {/* Next button */}
              <Button
                variant="outline"
                size="sm"
                disabled={page === (productsData?.data?.meta?.totalPage ?? 1)}
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, productsData?.data?.meta?.totalPage ?? 1)
                  )
                }
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
