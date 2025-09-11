"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  useOtpVerifyMutation,
  useResendOtpMutation,
} from "../../lib/redux/features/authApi";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { toast, ToastContainer } = useToast();

  const [oneTimeCode, setOneTimeCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [otpVerify] = useOtpVerifyMutation();
  const [resendOtp] = useResendOtpMutation();

  // Verify OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await otpVerify({
        email,
        oneTimeCode: Number(oneTimeCode),
      }).unwrap();

      // Save reset token from backend response
      if (result?.data) {
        localStorage.setItem("resetToken", result.data);
      }

      toast({ title: "OTP verified successfully!" });

      // Redirect to reset password page
      router.push(`/resetPassword?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: "OTP verification failed",
        description: error?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await resendOtp({ email }).unwrap();
      toast({
        title: "OTP resent successfully!",
        description: "Check your email for the new OTP.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error?.data?.message || error.message,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={oneTimeCode}
                onChange={(e) => setOneTimeCode(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center mt-2">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
