"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/app/features/auth/AuthContext";

interface Props {
  children: ReactNode;
}

export default function AuthProviderWrapper({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}