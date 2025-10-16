"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { useForgotPasswordMutation } from "../../lib/redux/features/authApi";

export default function ForgotPassword() {
  const router = useRouter();
  const { toast, ToastContainer } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword({ email }).unwrap();

      toast({
        title: "OTP sent!",
        description: "Check your email for the one-time passcode (OTP).",
      });

      // Redirect to OTP verification page
      router.push(`/verifyOtp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer />
    </div>
  );
}
