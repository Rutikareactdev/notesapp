"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, restore } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  if (!token) return null; // prevents protected UI flash

  return <>{children}</>;
}