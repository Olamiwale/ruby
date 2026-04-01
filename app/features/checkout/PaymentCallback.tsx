"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "@/app/lib/api/api.js";
import { clearCart } from "@/app/lib/redux/actions";

interface Payment {
  providerReference: string;
  amount: string | number;
  currency?: string;
  status: string;
}

type PaymentStatus = "verifying" | "success" | "failed";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("failed");
      setError("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/payment/verify/${reference}`);
        setPayment(res.data.data.payment);
        setStatus("success");
        dispatch(clearCart());
      } catch (err: any) {
        const message = err?.response?.data?.message || "Payment verification failed.";
        setError(message);
        setStatus("failed");
      }
    };

    verify();
  }, []);

  // Auto redirect to profile 3 seconds after success
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace("/profile");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  if (status === "verifying") {
    return (
      <div className="mt-[200px] flex flex-col items-center text-center">
        <p className="text-lg text-gray-500">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <span className="text-red-600 text-2xl">✕</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button
          onClick={() => router.push("/checkout")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <span className="text-green-600 text-2xl">✓</span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
      <p className="text-gray-500 text-sm mb-6">Your payment has been confirmed.</p>

      {payment && (
        <div className="w-full text-left border rounded p-4 mb-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Reference</span>
            <span className="font-medium">{payment.providerReference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: payment.currency || "NGN",
                minimumFractionDigits: 0,
              }).format(Number(payment.amount) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize text-green-600">{payment.status}</span>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-4">
        Redirecting to your profile in {countdown}s...
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => router.replace("/profile")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          View Profile
        </button>
        <button
          onClick={() => router.push("/")}
          className="border border-gray-300 text-gray-600 px-6 py-2 rounded"
        >
          Home
        </button>
      </div>
    </div>
  );
}







// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import api from "@/app/lib/api/api.js";
// import { clearCart } from "../redux/actions";

// export default function PaymentCallback() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const dispatch = useDispatch();

//   const [status, setStatus] = useState("verifying");
//   const [payment, setPayment] = useState(null);
//   const [error, setError] = useState("");
//   const [countdown, setCountdown] = useState(3);

//   useEffect(() => {
//     const reference = searchParams.get("reference") || searchParams.get("trxref");

//     if (!reference) {
//       setStatus("failed");
//       setError("No payment reference found.");
//       return;
//     }

//     const verify = async () => {
//       try {
//         const res = await api.get(`/payment/verify/${reference}`);
//         setPayment(res.data.data.payment);
//         setStatus("success");
//         dispatch(clearCart());
//       } catch (err) {
//         const message = err.response?.data?.message || "Payment verification failed.";
//         setError(message);
//         setStatus("failed");
//       }
//     };

//     verify();
//   }, []);

//   // Auto redirect to profile 3 seconds after success
//   useEffect(() => {
//     if (status !== "success") return;

//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           navigate("/profile", { replace: true });
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [status]);

//   if (status === "verifying") {
//     return (
//       <div className="mt-[200px] flex flex-col items-center text-center">
//         <p className="text-lg text-gray-500">Verifying your payment...</p>
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
//           <span className="text-red-600 text-2xl">✕</span>
//         </div>
//         <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
//         <p className="text-gray-500 text-sm mb-6">{error}</p>
//         <button
//           onClick={() => navigate("/checkout")}
//           className="bg-black text-white px-6 py-2 rounded"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
//       <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
//         <span className="text-green-600 text-2xl">✓</span>
//       </div>
//       <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
//       <p className="text-gray-500 text-sm mb-6">Your payment has been confirmed.</p>

//       {payment && (
//         <div className="w-full text-left border rounded p-4 mb-6 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span className="text-gray-500">Reference</span>
//             <span className="font-medium">{payment.providerReference}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-500">Amount</span>
//             <span className="font-medium">
//               {new Intl.NumberFormat("en-NG", {
//                 style: "currency",
//                 currency: payment.currency || "NGN",
//                 minimumFractionDigits: 0,
//               }).format(Number(payment.amount) || 0)}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-500">Status</span>
//             <span className="font-medium capitalize text-green-600">
//               {payment.status}
//             </span>
//           </div>
//         </div>
//       )}

//       <p className="text-sm text-gray-400 mb-4">
//         Redirecting to your profile in {countdown}s...
//       </p>

//       <div className="flex gap-3">
//         <button
//           onClick={() => navigate("/profile", { replace: true })}
//           className="bg-black text-white px-6 py-2 rounded"
//         >
//           View Profile
//         </button>
//         <button
//           onClick={() => navigate("/")}
//           className="border border-gray-300 text-gray-600 px-6 py-2 rounded"
//         >
//           Home
//         </button>
//       </div>
//     </div>
//   );
// }







// // import { useEffect, useState } from "react";
// // import { useNavigate, useSearchParams } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import api from "../api/api.js";
// // import { useAuth } from "../auth/AuthContext.jsx";
// // import { clearCart } from "../redux/actions";

// // export default function PaymentCallback() {
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();
// //   const { accessToken } = useAuth();
// //   const dispatch = useDispatch();

// //   const [status, setStatus] = useState("verifying");
// //   const [payment, setPayment] = useState(null);
// //   const [error, setError] = useState("");


  

// //   useEffect(() => {
// //     const reference = searchParams.get("reference") || searchParams.get("trxref");

// //     if (!reference) {
// //       setStatus("failed");
// //       setError("No payment reference found.");
// //       return;
// //     }

// //     const verify = async () => {
// //       try {
// //         const res = await api.get(`/payment/verify/${reference}`, {
// //          // headers: { Authorization: `Bearer ${accessToken}` },
         
// //         });

// //         setPayment(res.data.data.payment);
// //         setStatus("success");

// //         // Clear cart after successful payment
// //         dispatch(clearCart());

// //       } catch (err) {
// //         const message = err.response?.data?.message || "Payment verification failed.";
// //         setError(message);
// //         setStatus("failed");
// //       }
// //     };

// //     verify();
// //   }, []);

// //   if (status === "verifying") {
// //     return (
// //       <div className="mt-[200px] flex flex-col items-center text-center">
// //         <p className="text-lg text-gray-500">Verifying your payment...</p>
// //       </div>
// //     );
// //   }

// //   if (status === "failed") {
// //     return (
// //       <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
// //         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
// //           <span className="text-red-600 text-2xl">✕</span>
// //         </div>
// //         <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
// //         <p className="text-gray-500 text-sm mb-6">{error}</p>
// //         <button
// //           onClick={() => navigate("/checkout")}
// //           className="bg-black text-white px-6 py-2 rounded"
// //         >
// //           Try Again
// //         </button>
// //       </div>
// //     );
// //   }

 

// //   return (
// //     <div className="mt-[100px] flex flex-col items-center text-center max-w-md mx-auto p-6">
// //       <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
// //         <span className="text-green-600 text-2xl">✓</span>
// //       </div>
// //       <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
// //       <p className="text-gray-500 text-sm mb-6">Your payment has been confirmed.</p>

// //       {payment && (
// //         <div className="w-full text-left border rounded p-4 mb-6 text-sm space-y-2">
// //           <div className="flex justify-between">
// //             <span className="text-gray-500">Reference</span>
// //             <span className="font-medium">{payment.reference}</span>
// //           </div>



// //           <div className="flex justify-between">
// //             <span className="text-gray-500">Amount</span>
// //             <span className="font-medium">
// //               {new Intl.NumberFormat("en-NG", {
// //                 style: "currency",
// //                 currency: payment.currency || "NGN",
// //               }).format(payment.amount || 0)}
// //             </span>
// //           </div>



// //           <div className="flex justify-between">
// //             <span className="text-gray-500">Status</span>
// //             <span className="font-medium capitalize text-green-600">{payment.status}</span>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex gap-3">
// //         <button
// //           onClick={() => navigate("/profile")}
// //           className="bg-black text-white px-6 py-2 rounded"
// //         >
// //           View Profile
// //         </button>
// //         <button
// //           onClick={() => navigate("/")}
// //           className="border border-gray-300 text-gray-600 px-6 py-2 rounded"
// //         >
// //           Home
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
