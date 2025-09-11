"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {} from "@/lib/redux/apiSlice/productsApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Product } from "@/app/dashboard/products/page";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/lib/redux/apiSlice/categoriesApi";
import { Category } from "@/types/index";
import { ProductPayload } from "@/lib/redux/apiSlice/productsApi";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/lib/redux/apiSlice/productsApi";
import { getImageUrl } from "./imageUrl";
import { useGetBrandsQuery } from "@/lib/redux/apiSlice/brandsApi";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: "add" | "edit" | "view";
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  brandId: string;
  categoryId: string;
  stock: number;
  images: File[];
  gender: "MALE" | "FEMALE" | "UNISEX";
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
}

interface FormData {
  name: string;
  description: string;
  imageFile?: File;
  brandId?: string;
  price: number;
  categoryId: string;
  stock: number;
  gender: string;
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  mode,
}: ProductModalProps) {
  const dispatch = useDispatch();
  // const brands = useSelector((state: RootState) => state.data.brands);
  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetBrandsQuery({ page: 1, limit: 100 });

  const brands = brandsData?.data?.data || [];

  // Use brands in the Select

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(product?.brandId || "");
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category?._id || ""
  );

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const categories: Category[] = categoriesData?.data?.data ?? [];

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product?.images?.length) setExistingImages(product.images);
    else setExistingImages([]);
    setImageFiles([]);
    setSelectedBrand(product?.brandId || "");
    setSelectedCategory(product?.category?._id || "");
  }, [product]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      brandId: product?.brandId || "",
      categoryId: product?.category?._id || "",
      stock: product?.stock || 0,
      images: [],
      gender: (product?.gender as "MALE" | "FEMALE" | "UNISEX") || "MALE",
      modelNumber: product?.modelNumber || "",
      movement: product?.movement || "",
      caseDiameter: product?.caseDiameter || "",
      caseThickness: product?.caseThickness || "",
    },
  });

  const watchedCategory = watch("categoryId");
  const watchedGender = watch("gender");

  const onSubmit = async (data: {
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: string;
    gender: "MALE" | "FEMALE" | "UNISEX";
    modelNumber: string;
    movement: string;
    caseDiameter: string;
    caseThickness: string;
    images?: File[];
  }) => {
    try {
      const payload = {
        ...data,
        images: imageFiles, // imageFiles is your File[]
      };

      if (mode === "edit" && product) {
        await updateProduct({
          _id: product._id,
          ...payload, // payload is ProductPayload
        }).unwrap();
      } else {
        await addProduct(payload).unwrap();
      }

      // console.log("Product added:", result);
      reset(); // reset form
      setImageFiles([]);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("brandId", product.brandId || "");
      setValue("categoryId", product.category?._id || "");
      setValue(
        "gender",
        (product.gender as "MALE" | "FEMALE" | "UNISEX") || ""
      );
      setValue("modelNumber", product.modelNumber || "");
      setValue("movement", product.movement || "");
      setValue("caseDiameter", product.caseDiameter || "");
      setValue("caseThickness", product.caseThickness || "");
    }
  }, [product, setValue]);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    reset();
    setImageFiles([]);
    setExistingImages([]);
    setSelectedBrand("");
    setSelectedCategory("");
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Product";
      case "edit":
        return "Edit Product";
      case "view":
        return "Product Details";
      default:
        return "Product";
    }
  };

  const renderProductDetails = () => {
    if (!product) return null;

    return (
      <div className="space-y-6">
        {product.images?.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Product Name
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Description
                  </td>
                  <td className="py-2 px-4">{product.description}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Price
                  </td>
                  <td className="py-2 px-4">${product.price}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Stock
                  </td>
                  <td className="py-2 px-4">{product.stock} units</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Category
                  </td>
                  <td className="py-2 px-4">{product.category?.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Last Updated
                  </td>
                  <td className="py-2 px-4">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Specifications</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.gender && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Gender
                    </td>
                    <td className="py-2 px-4">{product.gender}</td>
                  </tr>
                )}
                {(product.modelNo || product.modelNumber) && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Model No
                    </td>
                    <td className="py-2 px-4">
                      {product.modelNo || product.modelNumber}
                    </td>
                  </tr>
                )}
                {product.movement && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Movement
                    </td>
                    <td className="py-2 px-4">{product.movement}</td>
                  </tr>
                )}
                {product.caseDiameter && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Case Diameter
                    </td>
                    <td className="py-2 px-4">{product.caseDiameter}</td>
                  </tr>
                )}
                {product.caseThickness && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Case Thickness
                    </td>
                    <td className="py-2 px-4">{product.caseThickness}</td>
                  </tr>
                )}
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td className="py-2 px-4">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (categoriesLoading) return <p>Loading...</p>;
  if (categoriesError) return <p>Error fetching categories</p>;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View product details"
              : mode === "edit"
              ? "Update product information"
              : "Create a new product"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <>
            {renderProductDetails()}
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      {...register("name", {
                        required: "Product name is required",
                      })}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                      })}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...register("stock", {
                        required: "Stock is required",
                        min: { value: 0, message: "Stock cannot be negative" },
                      })}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setValue("categoryId", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedCategory && (
                      <p className="text-sm text-amber-600">
                        Please select a category
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={watchedGender}
                      onValueChange={(value) => {
                        console.log("Selected gender:", value);
                        if (
                          value === "MALE" ||
                          value === "FEMALE" ||
                          value === "UNISEX"
                        ) {
                          setValue("gender", value);
                        }
                      }}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="UNISEX">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelNumber">Model Number</Label>
                    <Input
                      id="modelNumber"
                      {...register("modelNumber")}
                      placeholder="Enter model number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement">Movement</Label>
                    <Input
                      id="movement"
                      {...register("movement")}
                      placeholder="Enter movement type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseDiameter">Case Diameter</Label>
                    <Input
                      id="caseDiameter"
                      {...register("caseDiameter")}
                      placeholder="Enter case diameter (e.g., 42mm)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseThickness">Case Thickness</Label>
                    <Input
                      id="caseThickness"
                      {...register("caseThickness")}
                      placeholder="Enter case thickness (e.g., 10mm)"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Upload up to 5 product images. First image will be used as
                    the main product image.
                  </p>
                  <ImageUpload
                    value={imageFiles}
                    onChange={setImageFiles}
                    maxFiles={5}
                    accept="image/*"
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !selectedCategory}>
                {isLoading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
