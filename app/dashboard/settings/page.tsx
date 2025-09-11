"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Save,
  Upload,
  Shield,
  User,
  FileText,
  ScrollText,
  Eye,
  EyeOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  useGetProfileQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/lib/redux/apiSlice/settingsApi";
import { getImageUrl } from "@/components/dashboard/imageUrl";

// Import Jodit Editor dynamically to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function SettingsPage() {
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      // Call RTK Query mutation
      await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      // Success feedback
      alert("Password updated successfully!");

      // Clear form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password update error:", err);
      alert(err?.data?.message || "Failed to update password");
    }
  };

  // 👇 optional: always force refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [settings, setSettings] = useState({ name: "", email: "" });
  useEffect(() => {
    if (profileData?.data) {
      setSettings({
        name: profileData.data.name,
        email: profileData.data.email,
      });
      setProfileImage(profileData.data.profileImage || null);
    }
  }, [profileData]);

  const [updateProfile] = useUpdateProfileMutation();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: settings.name,
      email: settings.email,
    };

    if (profileImageFile) {
      payload.profileImage = profileImageFile;
    }

    try {
      const response = await updateProfile(payload).unwrap();
      console.log("Profile updated:", response.data);

      // Update local state
      setSettings({
        name: response.data.name,
        email: response.data.email,
      });

      // Force reload the image
      setProfileImage(
        response.data.profileImage + `?t=${new Date().getTime()}`
      );

      setProfileImageFile(null);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const privacyEditorRef = useRef(null);
  const termsEditorRef = useRef(null);

  // Initialize with default content
  useEffect(() => {
    setPrivacyPolicy(`
      <h3 class="font-medium mb-2">Privacy Policy</h3>
      <p class="text-sm text-muted-foreground mb-4">Last updated: June 15, 2023</p>
      <div class="space-y-4 text-sm">
        <p>This Privacy Policy describes how we collect, use, and disclose your personal information when you use our dashboard and related services.</p>
        <h4 class="font-medium">Information We Collect</h4>
        <p>We collect information you provide directly to us, such as when you create an account, update your profile, use interactive features, or contact support.</p>
        <h4 class="font-medium">How We Use Your Information</h4>
        <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, send notifications, and communicate with you.</p>
        <h4 class="font-medium">Data Security</h4>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      </div>
    `);

    setTermsConditions(`
      <h3 class="font-medium mb-2">Terms and Conditions</h3>
      <p class="text-sm text-muted-foreground mb-4">Last updated: June 15, 2023</p>
      <div class="space-y-4 text-sm">
        <p>By accessing or using our dashboard and services, you agree to be bound by these Terms and Conditions.</p>
        <h4 class="font-medium">User Accounts</h4>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        <h4 class="font-medium">Acceptable Use</h4>
        <p>You agree not to misuse our services or help anyone else do so. You must not use our services for any illegal or unauthorized purpose.</p>
        <h4 class="font-medium">Modifications to the Service</h4>
        <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice at any time.</p>
      </div>
    `);
  }, []);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Settings updated:", settings);
  // };

  const handlePrivacyUpdate = () => {
    console.log("Privacy Policy updated:", privacyPolicy);
    setIsPrivacyModalOpen(false);
  };

  const handleTermsUpdate = () => {
    console.log("Terms & Conditions updated:", termsConditions);
    setIsTermsModalOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file); // store the file for submit
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string); // preview
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="changePassword">Change Password</TabsTrigger>
          <TabsTrigger value="privacyPolicy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="termsCondition">Terms & Condition</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar and Image Upload */}
                <div className="flex flex-col gap-4 items-center justify-center">
                  <Avatar className="h-32 w-32">
                    {profileImage ? (
                      <AvatarImage
                        src={
                          profileImage?.startsWith("http") ||
                          profileImage?.startsWith("data:")
                            ? profileImage // already a full URL or Base64 preview
                            : getImageUrl(profileImage) // fallback: server path
                        }
                        alt="Profile"
                      />
                    ) : (
                      <AvatarFallback>Profile</AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profileUpload">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.name}
                      onChange={(e) =>
                        setSettings({ ...settings, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail">Email</Label>
                    <Input
                      id="profileEmail"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      disabled
                    />
                  </div>
                </div>

                {/* Optional fields */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter your address" />
                  </div>
                </div> */}

                {/* Save Button */}
                <div className="flex justify-center">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changePassword" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="space-y-5 w-full md:w-1/2">
                  {[
                    {
                      label: "Current Password",
                      state: showCurrentPassword,
                      setState: setShowCurrentPassword,
                      id: "currentPassword",
                      value: currentPassword,
                      setValue: setCurrentPassword,
                    },
                    {
                      label: "New Password",
                      state: showNewPassword,
                      setState: setShowNewPassword,
                      id: "newPassword",
                      value: newPassword,
                      setValue: setNewPassword,
                    },
                    {
                      label: "Confirm New Password",
                      state: showConfirmPassword,
                      setState: setShowConfirmPassword,
                      id: "confirmPassword",
                      value: confirmPassword,
                      setValue: setConfirmPassword,
                    },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="block text-center">
                        {field.label}
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.id}
                          type={field.state ? "text" : "password"}
                          placeholder={field.label}
                          value={field.value}
                          onChange={(e) => field.setValue(e.target.value)}
                          className="w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => field.setState(!field.state)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {field.state ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="mt-6 w-1/2"
                  onClick={async () => {
                    if (newPassword !== confirmPassword) {
                      alert("New password and confirm password do not match");
                      return;
                    }

                    try {
                      await updatePassword({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                      }).unwrap();

                      alert("Password updated successfully!");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    } catch (err: any) {
                      const message =
                        err?.data?.message ||
                        err?.error ||
                        "Something went wrong";

                      // console.error("Password update error:", message);
                      alert(message);
                    }
                  }}
                >
                  {isUpdatingPassword ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Update Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacyPolicy" className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mr-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <Button onClick={() => setIsPrivacyModalOpen(true)}>
                Edit Privacy Policy
              </Button>
            </div>
            <CardContent>
              <div className="p-4 border rounded-lg max-h-[500px] overflow-y-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: privacyPolicy }}
                  className="prose max-w-none"
                />
              </div>
            </CardContent>
          </Card>

          {isPrivacyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-4/5 max-w-4xl bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Privacy Policy
                  </h2>
                  <div className="mb-6">
                    {typeof window !== "undefined" && (
                      <JoditEditor
                        ref={privacyEditorRef}
                        value={privacyPolicy}
                        onChange={setPrivacyPolicy}
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPrivacyModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePrivacyUpdate}>
                      Update Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="termsCondition" className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mr-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />
                  Terms and Conditions
                </CardTitle>
              </CardHeader>

              <Button onClick={() => setIsTermsModalOpen(true)}>
                Edit Terms and Conditions
              </Button>
            </div>
            <CardContent>
              <div className="p-4 border rounded-lg max-h-[500px] overflow-y-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: termsConditions }}
                  className="prose max-w-none"
                />
              </div>
            </CardContent>
          </Card>

          {isTermsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-4/5 max-w-4xl bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Edit Terms and Conditions
                  </h2>
                  <div className="mb-6">
                    {typeof window !== "undefined" && (
                      <JoditEditor
                        ref={termsEditorRef}
                        value={termsConditions}
                        onChange={setTermsConditions}
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsTermsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleTermsUpdate}>
                      Update Terms and Conditions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
