"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api/api.js";
import { useAuth } from "@/app/features/auth/AuthContext";

function validateForm({ email, password }: { email: string; password: string }) {
  const errors: { email?: string; password?: string } = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Invalid email format";
  if (!password)
    errors.password = "Password is required";
  return errors;
}

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const from = searchParams.get("from") || "/profile";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      login(res.data.data.user, res.data.data.accessToken);
      router.push(from);
    } catch (err: any) {
      const message =
        err.response?.status === 401
          ? "Invalid email or password"
          : err.response?.data?.message || "Login failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[50px] flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm">Password</label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <button onClick={() => router.push("/signup")} className="text-blue-600 font-semibold hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}








// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../api/api.js";
// import { useAuth } from "./AuthContext.jsx"; // fixed: was AuthProvider.jsx

// function validateForm({ email, password }) {
//   const errors = {};
//   if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//     errors.email = "Invalid email format";
//   if (!password)
//     errors.password = "Password is required";
//   return errors;
// }

// export default function SignIn() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();
//   const from = location.state?.from?.pathname || "/profile";

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setServerError("");

//     const validationErrors = validateForm(form);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", {
//         email: form.email.toLowerCase().trim(),
//         password: form.password,
//       });

//       // fixed: pass both user and accessToken
//       login(res.data.data.user, res.data.data.accessToken);
//       navigate(from, { replace: true });

//     } catch (err) {
//       const message =
//         err.response?.status === 401
//           ? "Invalid email or password"
//           : err.response?.data?.message || "Login failed. Please try again.";
//       setServerError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-[50px] flex items-center justify-center">
//       <div className="max-w-md w-full p-6">
//         <h2 className="text-2xl font-semibold mb-4">Log In</h2>

//         {serverError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
//             {serverError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//           <div>
//             <label className="block text-sm mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               autoComplete="email"
//               className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`}
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>

//           <div>
//             <label className="block text-sm mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               autoComplete="current-password"
//               className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : ""}`}
//             />
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <p className="text-sm mt-4">
//           Don't have an account?{" "}
//           <button onClick={() => navigate("/signup")} className="text-blue-600 font-semibold hover:underline">
//             Register
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }