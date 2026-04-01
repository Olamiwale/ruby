"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api/api.js";

interface PasswordRule {
  regex: RegExp;
  message: string;
}

const passwordRules: PasswordRule[] = [
  { regex: /.{8,}/, message: "At least 8 characters" },
  { regex: /[A-Z]/, message: "One uppercase letter" },
  { regex: /[a-z]/, message: "One lowercase letter" },
  { regex: /[0-9]/, message: "One number" },
  { regex: /[^A-Za-z0-9]/, message: "One special character" },
];

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  if (!token) {
    return (
      <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Invalid link</h2>
        <p className="text-gray-500 text-sm mb-4">This reset link is invalid or has expired.</p>
        <button
          onClick={() => router.push("/forgot-password")}
          className="text-blue-600 hover:underline text-sm"
        >
          Request a new link
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const failedRules = passwordRules.filter((r) => !r.regex.test(password));
    if (failedRules.length > 0) {
      setError(failedRules.map((r) => r.message).join(", "));
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Password reset</h2>
        <p className="text-gray-500 text-sm mb-6">Your password has been updated. Please sign in.</p>
        <button
          onClick={() => router.push("/signin")}
          className="bg-black text-white px-6 py-2 rounded text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[50px] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-2">Reset your password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter a new password below.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm mb-1 font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full border p-2 rounded"
            />
            <p className="text-gray-400 text-xs mt-1">
              Min 8 chars, uppercase, lowercase, number, special character
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}





// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import api from "../api/api.js";

// const passwordRules = [
//   { regex: /.{8,}/, message: "At least 8 characters" },
//   { regex: /[A-Z]/, message: "One uppercase letter" },
//   { regex: /[a-z]/, message: "One lowercase letter" },
//   { regex: /[0-9]/, message: "One number" },
//   { regex: /[^A-Za-z0-9]/, message: "One special character" },
// ];

// export default function ResetPassword() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   if (!token) {
//     return (
//       <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
//         <h2 className="text-xl font-semibold mb-2">Invalid link</h2>
//         <p className="text-gray-500 text-sm mb-4">This reset link is invalid or has expired.</p>
//         <button onClick={() => navigate("/forgot-password")} className="text-blue-600 hover:underline text-sm">
//           Request a new link
//         </button>
//       </div>
//     );
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const failedRules = passwordRules.filter((r) => !r.regex.test(password));
//     if (failedRules.length > 0) {
//       setError(failedRules.map((r) => r.message).join(", "));
//       return;
//     }

//     if (password !== confirm) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/reset-password", { token, password });
//       setSuccess(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "Reset failed. The link may have expired.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
//         <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
//           <span className="text-green-600 text-2xl">✓</span>
//         </div>
//         <h2 className="text-2xl font-semibold mb-2">Password reset</h2>
//         <p className="text-gray-500 text-sm mb-6">Your password has been updated. Please sign in.</p>
//         <button
//           onClick={() => navigate("/signin")}
//           className="bg-black text-white px-6 py-2 rounded text-sm"
//         >
//           Sign In
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-[50px] flex items-center justify-center px-4">
//       <div className="max-w-md w-full p-6">
//         <h2 className="text-2xl font-semibold mb-2">Reset your password</h2>
//         <p className="text-gray-500 text-sm mb-6">Enter a new password below.</p>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//           <div>
//             <label className="block text-sm mb-1 font-medium">New Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="new-password"
//               className="w-full border p-2 rounded"
//             />
//             <p className="text-gray-400 text-xs mt-1">
//               Min 8 chars, uppercase, lowercase, number, special character
//             </p>
//           </div>
//           <div>
//             <label className="block text-sm mb-1 font-medium">Confirm Password</label>
//             <input
//               type="password"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               autoComplete="new-password"
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }