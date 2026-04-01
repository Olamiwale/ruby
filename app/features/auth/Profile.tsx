"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import api from "@/app/lib/api/api.js";

interface OrderItem {
  productName: string;
  quantity: number;
  size: string;
  color: string;
}

interface Payment {
  id: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: string | number;
  currency?: string;
  createdAt: string;
  providerReference?: string;
  order?: {
    items: OrderItem[];
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: string | number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-xl font-bold tracking-wide flex-shrink-0">
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  };
  const cls = styles[status.toUpperCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`${cls} text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full`}>
      {status}
    </span>
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, logout, accessToken } = useAuth();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
  const [paymentsError, setPaymentsError] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payment/my-payments", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPayments(res.data.data || []);
      } catch {
        setPaymentsError("Could not load payment history.");
      } finally {
        setPaymentsLoading(false);
      }
    };
    if (accessToken) fetchPayments();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    router.push("/signin");
  };

  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  if (!user) return null;

  // Safe cast to access createdAt which may exist on the user object from the backend
  const createdAt = (user as unknown as { createdAt?: string }).createdAt;

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-10 pb-20 font-serif">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header card */}
        <div className="bg-gray-900 rounded-2xl px-8 py-8 flex flex-wrap items-center gap-5">
          <Avatar firstName={user.firstName} lastName={user.lastName} />
          <div className="flex-1 min-w-[160px]">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">Customer Account</p>
            <h1 className="text-xl font-bold text-white leading-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
          {createdAt && (
            <div className="text-right">
              <p className="text-xs tracking-widest text-gray-600 uppercase mb-1">Member Since</p>
              <p className="text-sm text-gray-300 font-medium">{formatDate(createdAt)}</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl px-6 py-5 border border-stone-200">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="bg-white rounded-xl px-6 py-5 border border-stone-200">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">{formatAmount(totalSpent)}</p>
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-800">
              Payment History
            </h2>
            {payments.length > 0 && (
              <span className="text-xs text-gray-400">
                {payments.length} transaction{payments.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {paymentsLoading ? (
            <div className="px-7 py-10 text-center text-gray-300 text-sm">Loading...</div>
          ) : paymentsError ? (
            <div className="px-7 py-10 text-center text-red-400 text-sm">{paymentsError}</div>
          ) : payments.length === 0 ? (
            <div className="px-7 py-12 text-center">
              <p className="text-gray-400 text-sm mb-4">No payments yet.</p>
              <button
                onClick={() => router.push("/checkout")}
                className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Make a Payment
              </button>
            </div>
          ) : (
            payments.map((payment, i) => {
              const items: OrderItem[] = payment.order?.items || [];
              const isExpanded = expandedId === payment.id;

              return (
                <div
                  key={payment.id}
                  className={`${i < payments.length - 1 ? "border-b border-stone-100" : ""}`}
                >
                  {/* Payment row — clickable to expand */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-7 py-5 hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {payment.providerReference || `Payment #${i + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(payment.createdAt)}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {items.length} item{items.length !== 1 ? "s" : ""} — tap to {isExpanded ? "collapse" : "view"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={payment.status} />
                      <p className="text-base font-bold text-gray-900">
                        {formatAmount(payment.amount, payment.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isExpanded && items.length > 0 && (
                    <div className="px-7 pb-5 bg-black border-t border-stone-100">
                      <p className="text-xs uppercase tracking-widest text-gray-400 py-3">Items Purchased</p>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex flex-col gap-3">
                              <p className="font-medium text-gray-400">Product Name: {item.productName}</p>
                              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                              <p className="text-sm text-gray-400">Size: {item.size}</p>
                              <p className="text-sm text-gray-400">Colour: {item.color}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded but no items recorded */}
                  {isExpanded && items.length === 0 && (
                    <div className="px-7 pb-4 bg-stone-50 border-t border-stone-100">
                      <p className="text-xs text-gray-400 py-3 italic">
                        No item details recorded for this order.
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => router.push("/")}
            className="border border-gray-300 text-gray-500 text-sm px-7 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white text-sm px-7 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "./AuthContext";
// import api from "@/app/lib/api/api.js";



// interface OrderItem {
//   productName: string;
//   quantity: number;
//   size: string;
//   color: string;
// }

// interface Payment {
//   id: string;
//   status: "SUCCESS" | "FAILED" | "PENDING";
//   amount: string | number;
//   currency?: string;
//   createdAt: string;
//   providerReference?: string;
//   order?: {
//     items: OrderItem[];
//   };
// }



// function formatDate(iso: string): string {
//   return new Date(iso).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// function formatAmount(amount: string | number, currency = "NGN"): string {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 0,
//   }).format(Number(amount) || 0);
// }



// function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
//   const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
//   return (
//     <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-xl font-bold tracking-wide flex-shrink-0">
//       {initials}
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     success: "bg-green-100 text-green-800",
//     failed: "bg-red-100 text-red-800",
//     pending: "bg-yellow-100 text-yellow-800",
//     SUCCESS: "bg-green-100 text-green-800",
//     FAILED: "bg-red-100 text-red-800",
//     PENDING: "bg-yellow-100 text-yellow-800",
//   };
//   const cls = styles[status] ?? "bg-gray-100 text-gray-600";
//   return (
//     <span className={`${cls} text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full`}>
//       {status}
//     </span>
//   );
// }



// export default function Profile() {
//   const router = useRouter();
//   const { user, logout, accessToken } = useAuth();

//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [paymentsLoading, setPaymentsLoading] = useState<boolean>(true);
//   const [paymentsError, setPaymentsError] = useState<string>("");
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const res = await api.get("/payment/my-payments", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         setPayments(res.data.data || []);
//       } catch {
//         setPaymentsError("Could not load payment history.");
//       } finally {
//         setPaymentsLoading(false);
//       }
//     };
//     if (accessToken) fetchPayments();
//   }, [accessToken]);

//   const handleLogout = async () => {
//     await logout();
//     router.push("/signin");
//   };

//   const totalSpent = payments
//     .filter((p) => p.status === "SUCCESS")
//     .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

//   // Guard — user should always exist here (wrapped in ProtectedRoute)
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-stone-100 px-4 py-10 pb-20 font-serif">
//       <div className="max-w-3xl mx-auto space-y-4">

//         {/* Header card */}
//         <div className="bg-gray-900 rounded-2xl px-8 py-8 flex flex-wrap items-center gap-5">
//           <Avatar firstName={user.firstName} lastName={user.lastName} />
//           <div className="flex-1 min-w-[160px]">
//             <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">Customer Account</p>
//             <h1 className="text-xl font-bold text-white leading-tight">
//               {user.firstName} {user.lastName}
//             </h1>
//             <p className="text-sm text-gray-400 mt-1">{user.email}</p>
//           </div>
//           {user.createdAt && (
//             <div className="text-right">
//               <p className="text-xs tracking-widest text-gray-600 uppercase mb-1">Member Since</p>
//               <p className="text-sm text-gray-300 font-medium">{formatDate((user as Record<string, unknown>).createdAt as string)}</p>
//             </div>
//           )}
//         </div>

//         {/* Stats row */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-white rounded-xl px-6 py-5 border border-stone-200">
//             <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Total Orders</p>
//             <p className="text-4xl font-bold text-gray-900">{payments.length}</p>
//           </div>
//           <div className="bg-white rounded-xl px-6 py-5 border border-stone-200">
//             <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Total Spent</p>
//             <p className="text-3xl font-bold text-gray-900">{formatAmount(totalSpent)}</p>
//           </div>
//         </div>

//         {/* Payment history */}
//         <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
//           <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
//             <h2 className="text-xs font-bold tracking-widest uppercase text-gray-800">
//               Payment History
//             </h2>
//             {payments.length > 0 && (
//               <span className="text-xs text-gray-400">
//                 {payments.length} transaction{payments.length !== 1 ? "s" : ""}
//               </span>
//             )}
//           </div>

//           {paymentsLoading ? (
//             <div className="px-7 py-10 text-center text-gray-300 text-sm">Loading...</div>
//           ) : paymentsError ? (
//             <div className="px-7 py-10 text-center text-red-400 text-sm">{paymentsError}</div>
//           ) : payments.length === 0 ? (
//             <div className="px-7 py-12 text-center">
//               <p className="text-gray-400 text-sm mb-4">No payments yet.</p>
//               <button
//                 onClick={() => router.push("/checkout")}
//                 className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 Make a Payment
//               </button>
//             </div>
//           ) : (
//             payments.map((payment, i) => {
//               const items: OrderItem[] = payment.order?.items || [];
//               const isExpanded = expandedId === payment.id;

//               return (
//                 <div
//                   key={payment.id}
//                   className={`${i < payments.length - 1 ? "border-b border-stone-100" : ""}`}
//                 >
//                   {/* Payment row — clickable to expand */}
//                   <div
//                     className="flex flex-wrap items-center justify-between gap-3 px-7 py-5 hover:bg-stone-50 transition-colors cursor-pointer"
//                     onClick={() => setExpandedId(isExpanded ? null : payment.id)}
//                   >
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">
//                         {payment.providerReference || `Payment #${i + 1}`}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">{formatDate(payment.createdAt)}</p>
//                       <p className="text-sm text-gray-400 mt-0.5">
//                         {items.length} item{items.length !== 1 ? "s" : ""} — tap to {isExpanded ? "collapse" : "view"}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <StatusBadge status={payment.status} />
//                       <p className="text-base font-bold text-gray-900">
//                         {formatAmount(payment.amount, payment.currency)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Expanded items */}
//                   {isExpanded && items.length > 0 && (
//                     <div className="px-7 pb-5 bg-black border-t border-stone-100">
//                       <p className="text-xs uppercase tracking-widest text-gray-400 py-3">Items Purchased</p>
//                       <div className="space-y-2">
//                         {items.map((item, idx) => (
//                           <div key={idx} className="flex justify-between items-center text-sm">
//                             <div className="flex flex-col gap-3">
//                               <p className="font-medium text-gray-400">Product Name: {item.productName}</p>
//                               <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
//                               <p className="text-sm text-gray-400">Size: {item.size}</p>
//                               <p className="text-sm text-gray-400">Colour: {item.color}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Expanded but no items recorded */}
//                   {isExpanded && items.length === 0 && (
//                     <div className="px-7 pb-4 bg-stone-50 border-t border-stone-100">
//                       <p className="text-xs text-gray-400 py-3 italic">
//                         No item details recorded for this order.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-center gap-3 pt-2">
//           <button
//             onClick={() => router.push("/")}
//             className="border border-gray-300 text-gray-500 text-sm px-7 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Home
//           </button>
//           <button
//             onClick={handleLogout}
//             className="bg-gray-900 text-white text-sm px-7 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             Sign Out
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
