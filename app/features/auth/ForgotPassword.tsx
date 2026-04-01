"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api/api.js";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: email.toLowerCase().trim() });
      setSubmitted(true);
    } catch {
      // Show success regardless — never reveal if email exists
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm mb-6">
          If an account with that email exists, we&apos;ve sent a reset link. Check your inbox — it expires in 30 minutes.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[50px] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-2">Forgot password</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          <button
            onClick={() => router.push("/signin")}
            className="text-blue-600 hover:underline"
          >
            Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
}











// "use client"

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/app/lib/api/api.js";

// export default function ForgotPassword() {
//   const navigate = useRouter();
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/forgot-password", { email: email.toLowerCase().trim() });
//       setSubmitted(true);
//     } catch {
//       // Show success regardless — never reveal if email exists
//       setSubmitted(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
//         <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
//           <span className="text-green-600 text-2xl">✓</span>
//         </div>
//         <h2 className="text-2xl font-semibold mb-2">Check your email</h2>
//         <p className="text-gray-500 text-sm mb-6">
//           If an account with that email exists, we've sent a reset link. Check your inbox — it expires in 30 minutes.
//         </p>
//         <button onClick={() => navigate("/signin")} className="text-sm text-blue-600 hover:underline">
//           Back to Sign In
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-[50px] flex items-center justify-center px-4">
//       <div className="max-w-md w-full p-6">
//         <h2 className="text-2xl font-semibold mb-2">Forgot password</h2>
//         <p className="text-gray-500 text-sm mb-6">
//           Enter your email and we'll send you a reset link.
//         </p>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
//             {error}
//           </div> )}

//         <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//           <div>
//             <label className="block text-sm mb-1 font-medium">Email</label>
//             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//               autoComplete="email" className="w-full border p-2 rounded"/>
//           </div>

//           <button type="submit" disabled={loading}
//             className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50" >
//             {loading ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>

//         <p className="text-sm mt-4 text-center">
//           <button onClick={() => navigate("/signin")} className="text-blue-600 hover:underline">
//             Back to Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }