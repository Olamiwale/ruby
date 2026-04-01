"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/signin");
    } else if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") return null;

  return <>{children}</>;
}








// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext.js";

// export default function AdminRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div className="p-8 text-center text-gray-400">Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/signin" replace />;
//   }

//   if (user.role !== "ADMIN") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }