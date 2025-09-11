"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getImageUrl } from "./imageUrl";

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  existingImages?: string[];
  onRemoveExisting?: (index: number) => void;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  accept = "image/*",
  className,
  existingImages = [],
  onRemoveExisting,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  // Generate previews for new files
  // useEffect(() => {
  //   // Clean up previous preview URLs to avoid memory leaks
  //   return () => {
  //     previews.forEach((preview) => URL.revokeObjectURL(preview));
  //   };
  // }, []);

  useEffect(() => {
    // Generate previews for files when they change
    const newPreviews = value.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      // Clean up created object URLs when component unmounts or files change
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [value]);

  useEffect(() => {
    // Generate previews for files when they change
    const newPreviews = value.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      // Clean up created object URLs when component unmounts or files change
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Calculate how many more files we can add
      const remainingSlots = maxFiles - value.length - existingImages.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        onChange([...value, ...filesToAdd]);
      }
    },
    [value, onChange, maxFiles, existingImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: maxFiles - value.length - existingImages.length,
    multiple: true,
    disabled: value.length + existingImages.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const totalImages = value.length + existingImages.length;
  const isMaxReached = totalImages >= maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      {!isMaxReached && (
        <Card
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed cursor-pointer transition-colors p-6",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            isMaxReached && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {`${totalImages} of ${maxFiles} images added`}
            </p>
          </div>
        </Card>
      )}

      {/* Preview Grid */}
      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Existing Images */}
          {existingImages.map((image, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(image)}
                  alt={`Existing Image ${index + 1}`}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover"
                />
              </div>
              {onRemoveExisting && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveExisting(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          {/* New Images */}
          {/* New Images */}
          {value.map((_, index) => (
            <div key={`new-${index}`} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {previews[index] ? (
                  <Image
                    src={previews[index]}
                    alt={`New Image ${index + 1}`}
                    height={200}
                    width={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full text-gray-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isMaxReached && (
        <p className="text-amber-600 text-sm">
          Maximum number of images reached ({maxFiles}). Remove some images to
          add more.
        </p>
      )}
    </div>
  );
}
