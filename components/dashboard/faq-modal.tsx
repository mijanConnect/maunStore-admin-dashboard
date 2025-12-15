"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateFAQMutation,
  useUpdateFAQMutation,
} from "@/lib/redux/apiSlice/faqApi";
import { FAQ } from "@/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: FAQ | null;
  mode: "add" | "edit" | "view";
}

interface FormData {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export default function FAQModal({
  isOpen,
  onClose,
  item,
  mode,
}: FAQModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { question: "", answer: "", category: "", isActive: true },
  });

  // Set form values in edit/view modes
  useEffect(() => {
    if (item && (mode === "edit" || mode === "view")) {
      setValue("question", item.question);
      setValue("answer", item.answer);
      setValue("category", item.category || "");
      setValue("isActive", item.isActive !== false);
    } else {
      reset();
    }
  }, [item, mode, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      if (mode === "add") {
        const result = await createFAQ(data).unwrap();
        toast.success("FAQ added successfully!");
      } else if (mode === "edit" && item) {
        const result = await updateFAQ({
          id: item._id,
          payload: data,
        }).unwrap();
        toast.success("FAQ updated successfully!");
      }

      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add FAQ"
              : mode === "edit"
              ? "Edit FAQ"
              : "View FAQ"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new FAQ item"
              : mode === "edit"
              ? "Edit the FAQ item"
              : "View FAQ details"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Question</Label>
              <p className="text-sm mt-1">{item?.question}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Answer</Label>
              <p className="text-sm mt-1">{item?.answer}</p>
            </div>
            {item?.category && (
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm mt-1">{item.category}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                placeholder="Enter question"
                {...register("question", {
                  required: "Question is required",
                })}
                disabled={isLoading}
              />
              {errors.question && (
                <p className="text-sm text-red-500">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                placeholder="Enter answer"
                rows={4}
                {...register("answer", {
                  required: "Answer is required",
                })}
                disabled={isLoading}
              />
              {errors.answer && (
                <p className="text-sm text-red-500">{errors.answer.message}</p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Enter category (optional)"
                {...register("category")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  disabled={isLoading}
                />
                <Label htmlFor="isActive" className="!mt-0">
                  Active
                </Label>
              </div>
            </div> */}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add FAQ"
                  : "Update FAQ"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
