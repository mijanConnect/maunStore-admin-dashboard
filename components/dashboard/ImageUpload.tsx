"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: File[];
  existingImages?: string[];
  maxFiles?: number;
  setFiles: (files: File[]) => void;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [], // default to empty array
  existingImages = [], // default to empty array
  maxFiles = 5,
  setFiles,
  accept = "image/*",
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...value, ...acceptedFiles]);
    },
    [value, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: maxFiles - (value?.length || 0) - (existingImages?.length || 0),
    multiple: true,
    disabled: (value?.length || 0) + (existingImages?.length || 0) >= maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>
          Drag & drop some files here, or click to select files (max {maxFiles}{" "}
          images)
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {existingImages?.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`Existing ${idx}`}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
        {value?.map((file, idx) => (
          <Image
            key={idx}
            src={URL.createObjectURL(file)}
            alt={`Upload ${idx}`}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
