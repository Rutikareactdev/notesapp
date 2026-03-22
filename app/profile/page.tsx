"use client"
import { useState } from "react";
import { ArrowLeft, Save, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";


export default function Profile() {
 
const {user,token}= useAuthStore();
  const [name, setName] = useState(user?.name || "John Doe");
  const [email, setEmail] = useState(user?.email|| "john@example.com");
  const [isSaving, setIsSaving] = useState(false);
  const router= useRouter();

 const handleSave = async () => {
  setIsSaving(true);
  try {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    });

    const data = await res.json();
    console.log(data);

  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        
        </div>
      </header>

      <main className="flex-col items-center justify-center mx-80 mt-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Click on the avatar to upload a new picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
      

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-primary hover:opacity-90 py-2 rounded-2xl"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
