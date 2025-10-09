"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../../components/ui/use-toast";
import { useLoginMutation } from "../../lib/redux/features/authApi";
import { setCredentials } from "../../lib/redux/features/authSlice";
import { api } from "../../lib/redux/features/baseApi"; // ✅ import baseApi

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast, ToastContainer } = useToast();

  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    try {
      const result = await login({ email, password }).unwrap();

      // Extract token and user
      const token = result.data.token;
      const user = result.data.user;

      // ✅ Save in Redux
      dispatch(setCredentials({ user, token }));

      // ✅ Save in localStorage for API usage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Reset RTK Query cache so profile refetches with the new token
      dispatch(api.util.invalidateTags(["Profile"]));

      toast({ title: "Login successful!" });
      router.push("/dashboard/products");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error when user types
                }}
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error when user types
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="flex justify-end mt-2">
            <Link
              href="/forgotPassword"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password
            </Link>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}
