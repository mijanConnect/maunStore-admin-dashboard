"use client";

import * as React from "react";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = React.useState<
    { id: number; title: string; description?: string }[]
  >([]);

  function toast({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) {
    setToasts((prev) => [...prev, { id: ++toastId, title, description }]);
  }

  return {
    toast,
    ToastContainer: () => (
      <ToastProvider>
        {toasts.map((t) => (
          <Toast key={t.id}>
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && (
              <ToastDescription>{t.description}</ToastDescription>
            )}
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    ),
  };
}
