"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApplicationLinkProps {
  link?: string;
}

export default function ApplicationLink({
  // link = "https://raconliapp.com/download",
  link = "https://play.google.com/store/apps/details?id=com.raconligroup.watch_store&hl=en",
}: ApplicationLinkProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      // Preferred: modern clipboard API
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(link);
      } else if (typeof document !== "undefined") {
        // Fallback: textarea + execCommand
        const textarea = document.createElement("textarea");
        textarea.value = link;
        // Move off-screen
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!successful) throw new Error("execCommand copy failed");
      } else {
        throw new Error("No copy mechanism available");
      }

      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Log actual error for debugging; show user-friendly toast
      // eslint-disable-next-line no-console
      console.error("ApplicationLink: copy failed", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Card className="border-2 border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="h-5 w-5 text-[#E3A45C]" />
              <h3 className="text-lg font-semibold text-gray-900">
                Application Download Link
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Share this link with users to download the mobile app
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm text-gray-700 shadow-sm">
                {link}
              </div>
              <Button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 transition-all ${
                  isCopied
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#E3A45C] hover:bg-[#E3A45C]/80"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
