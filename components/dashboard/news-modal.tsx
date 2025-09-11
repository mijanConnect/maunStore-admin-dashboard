"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { addNews, updateNews } from "@/lib/redux/features/dataSlice";
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
import { ImageUpload } from "@/components/dashboard/image-upload";
import { News } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getImageUrl } from "./imageUrl";
import {
  useCreateNewsMutation,
  useUpdateNewsMutation,
} from "@/lib/redux/apiSlice/newsApi";

import { useRef } from "react";

// Dynamically import Jodit Editor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news?: News | null;
  mode: "add" | "edit" | "view";
}

interface FormData {
  title: string;
  description: string;
  image: File[];
}

export function NewsModal({ isOpen, onClose, news, mode }: NewsModalProps) {
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const editor = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      image: [],
    },
  });

  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  const onSubmit = async () => {
    if (mode === "view") return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", getValues("title"));
    formData.append("description", content);
    if (imageFiles.length > 0) {
      formData.append("image", imageFiles[0]);
    }

    try {
      if (mode === "edit" && news?._id) {
        await updateNews({ id: news._id, formData }).unwrap();
      } else {
        await createNews(formData).unwrap();
      }
      onClose();
      reset();
      setImageFiles([]);
      setContent("");
    } catch (err) {
      console.error("Failed to save news:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set form values when news changes or modal opens
  useEffect(() => {
    if (news && (mode === "edit" || mode === "view")) {
      setValue("title", news.title);
      setContent(news.description || "");
    } else if (mode === "add") {
      setValue("title", "");
      setContent("");
    }
  }, [news, mode, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImageFiles([]);
      setContent("");
    }
  }, [isOpen, reset]);

  // const onSubmit = async (data: FormData) => {
  //   if (mode === "view") return;

  //   setIsLoading(true);

  //   const newsData: News = {
  //     _id: news?._id || Date.now().toString(),
  //     title: data.title,
  //     description: content,
  //     image:
  //       imageFiles.length > 0
  //         ? URL.createObjectURL(imageFiles[0])
  //         : news?.image,
  //     createdAt: news?.createdAt || new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };

  //   if (mode === "edit" && news) {
  //     dispatch(updateNews(newsData));
  //   } else {
  //     dispatch(addNews(newsData));
  //   }

  //   setIsLoading(false);
  //   reset();
  //   setImageFiles([]);
  //   setContent("");
  //   onClose();
  // };

  const handleClose = () => {
    reset();
    setImageFiles([]);
    setContent("");
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add News Article";
      case "edit":
        return "Edit News Article";
      case "view":
        return "View News Article";
      default:
        return "News Article";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "add":
        return "Create a new news article or announcement";
      case "edit":
        return "Update news article information";
      case "view":
        return "View news article details";
      default:
        return "";
    }
  };

  const editorConfig = {
    readonly: mode === "view",
    height: 300,
    toolbar: mode !== "view",
    toolbarButtonSize: "small" as const,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "paragraph",
      "|",
      "link",
      "image",
      "|",
      "align",
      "|",
      "undo",
      "redo",
      "|",
      "source",
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">News Title</Label>
            <Input
              id="title"
              {...register("title", {
                required: mode !== "view" ? "Title is required" : false,
              })}
              placeholder="Enter news title"
              disabled={mode === "view"}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">News Description</Label>
            <div className="min-h-[300px]">
              <JoditEditor
                ref={editor}
                value={content}
                config={editorConfig}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          {mode !== "view" && (
            <div className="space-y-2">
              <Label>News Image</Label>
              <ImageUpload
                value={imageFiles}
                onChange={setImageFiles}
                maxFiles={1}
                accept="image/*"
              />
            </div>
          )}

          {mode === "view" && news?.image && (
            <div className="space-y-2">
              <Label>News Image</Label>
              <div className="w-full max-w-md bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(news.image)}
                  alt={news.title}
                  height={200}
                  width={200}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {mode === "view" && news && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-500 block mb-2">Description</Label>
                <div
                  className="prose max-w-none border rounded-md p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: news.description }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p>{new Date(news.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Updated At</Label>
                  <p>{new Date(news.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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
