"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import AuthProvider from "@/components/uiComponents/AuthProvider";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  return <>
       <AuthProvider>
        {children}
       </AuthProvider>
  </>;
}