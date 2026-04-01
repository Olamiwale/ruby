"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  if (!user) return null;

  return <>{children}</>;
}



// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./AuthContext"; // was wrongly importing from "./AuthProvider"

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   // Wait for session restore — prevents redirect flash on page refresh
//   if (loading) {
//     return <div className="p-8 text-center text-gray-400">Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/signin" replace state={{ from: location }} />;
//   }

//   return children;
// }




