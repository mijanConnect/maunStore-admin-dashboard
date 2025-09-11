"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useAddBrandMutation,
  useUpdateBrandMutation,
} from "@/lib/redux/apiSlice/brandsApi";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/redux/apiSlice/categoriesApi";
import { useGetBrandsQuery } from "@/lib/redux/apiSlice/brandsApi";
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
import { ImageUpload } from "@/components/dashboard/image-upload";
import Image from "next/image";
import { getImageUrl } from "./imageUrl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any | null;
  mode: "add" | "edit" | "view";
  type: "brand" | "category";
}

interface FormData {
  name: string;
  description: string;
  imageFile?: File;
  brandId?: string;
}

export default function BrandCategoryModal({
  isOpen,
  onClose,
  item,
  mode,
  type,
}: ModalProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const { data: brandsData } = useGetBrandsQuery({});
  const brands = brandsData?.data?.data || [];

  // Initialize form with defaultValues
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", description: "", brandId: "" },
  });

  // useEffect to set form values in edit/view modes
  useEffect(() => {
    if (item && (mode === "edit" || mode === "view")) {
      setValue("name", item.name);
      setValue("description", item.description);

      if (type === "category" && item.brandId) {
        // ✅ Make sure we set brandId as string ID
        const brandId =
          typeof item.brandId === "string" ? item.brandId : item.brandId._id;
        setValue("brandId", brandId);
      }
    } else if (mode === "add") {
      reset();
    }
  }, [item, mode, reset, setValue, type]);

  const onSubmit = async (data: FormData) => {
    if (mode === "view") return;
    setIsLoading(true);

    try {
      if (type === "brand") {
        const payload = {
          name: data.name,
          description: data.description,
          imageFile: imageFiles[0],
        };
        if (mode === "edit" && item) {
          await updateBrand({ _id: item._id, ...payload }).unwrap();
        } else {
          await addBrand(payload).unwrap();
        }
      } else if (type === "category") {
        if (!data.brandId) {
          alert("Please select a brand");
          setIsLoading(false);
          return;
        }

        const payload = {
          name: data.name,
          description: data.description,
          imageFile: imageFiles[0],
          brandId: data.brandId,
        };
        if (mode === "edit" && item) {
          await updateCategory({ _id: item._id, ...payload }).unwrap();
        } else {
          await addCategory(payload).unwrap();
        }
      }
    } finally {
      setIsLoading(false);
      reset();
      setImageFiles([]);
      onClose();
    }
  };

  const getTitle = () => {
    if (mode === "add") return `Add ${type}`;
    if (mode === "edit") return `Edit ${type}`;
    if (mode === "view") return `View ${type}`;
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? `Create a new ${type}`
              : mode === "edit"
              ? `Update ${type}`
              : `View ${type}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{type} Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              disabled={mode === "view"}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              rows={3}
              disabled={mode === "view"}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Brand Selector */}
          {type === "category" && (
            <div className="space-y-2">
              <Label>Assign Brand</Label>
              {mode === "view" ? (
                <p className="p-2 border rounded bg-gray-50">
                  {brands.find(
                    (b) =>
                      b._id ===
                      (typeof item.brandId === "string"
                        ? item.brandId
                        : item.brandId?._id)
                  )?.name || "N/A"}
                </p>
              ) : (
                <select
                  {...register("brandId", { required: "Brand is required" })}
                  className="w-full border rounded p-2"
                  value={watch("brandId") || ""}
                  onChange={(e) => setValue("brandId", e.target.value)}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.brandId && (
                <p className="text-sm text-red-500">{errors.brandId.message}</p>
              )}
            </div>
          )}

          {/* Image Upload */}
          {mode !== "view" && (
            <div className="space-y-2">
              <Label>{type} Image</Label>
              <ImageUpload
                value={imageFiles}
                onChange={setImageFiles}
                maxFiles={1}
                accept="image/*"
              />
            </div>
          )}

          {/* View Image */}
          {mode === "view" && item?.image && (
            <div className="space-y-2">
              <Label>{type} Image</Label>
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update"
                  : "Create"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
