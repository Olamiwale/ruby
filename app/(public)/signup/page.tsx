"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api/api.js";
import { useAuth } from "@/app/features/auth/AuthContext";

const passwordRules = [
  { regex: /.{8,}/, message: "At least 8 characters" },
  { regex: /[A-Z]/, message: "One uppercase letter" },
  { regex: /[a-z]/, message: "One lowercase letter" },
  { regex: /[0-9]/, message: "One number" },
  { regex: /[^A-Za-z0-9]/, message: "One special character" },
];

function validateForm({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) {
  const errors: { firstName?: string; lastName?: string; email?: string; password?: string } = {};

  if (!firstName || firstName.trim().length < 2)
    errors.firstName = "First name must be at least 2 characters";
  else if (firstName.trim().length > 50)
    errors.firstName = "First name must not exceed 50 characters";

  if (!lastName || lastName.trim().length < 2)
    errors.lastName = "Last name must be at least 2 characters";
  else if (lastName.trim().length > 50)
    errors.lastName = "Last name must not exceed 50 characters";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Invalid email format";

  const failedRules = passwordRules.filter((r) => !r.regex.test(password));
  if (failedRules.length > 0)
    errors.password = failedRules.map((r) => r.message).join(", ");

  return errors;
}

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const from = searchParams.get("from") || "/profile";

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      // fixed: pass both user and accessToken
      login(res.data.data.user, res.data.data.accessToken);
      router.push(from);

    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[50px] flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Create an account</h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              className={`w-full border p-2 rounded ${errors.firstName ? "border-red-500" : ""}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              className={`w-full border p-2 rounded ${errors.lastName ? "border-red-500" : ""}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

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
            <label className="block text-sm mb-1">Password</label>
            <input
             
             
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-gray-700 text-sm mt-1">
                Min 8 chars, uppercase, lowercase, number, special character
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <button onClick={() => router.push("/signin")} className="text-blue-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}