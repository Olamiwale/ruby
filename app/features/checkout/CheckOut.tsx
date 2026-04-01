"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import api from "@/app/lib/api/api.js";
import { useAuth } from "../auth/AuthContext";
import { RootState } from "@/app/lib/redux/store";

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  size?: string;
  color?: string;
}

export default function Checkout() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const [currency, setCurrency] = useState<string>("NGN");
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setServerError("");

    if (cartItems.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    if (totalAmount > 10000000) {
      setServerError("Order total too large.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/payment/initiate",
        {
          amount: totalAmount,
          currency,
          provider: "PAYSTACK",
          metadata: {
            itemCount: String(cartItems.length),
            totalAmount: String(totalAmount),
            items: JSON.stringify(
              cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size || null,
                color: item.color || null,
              }))
            ),
          },
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const paystackUrl: string =
        res.data.data?.authorizationUrl || res.data.data?.authorization_url;

      if (!paystackUrl) {
        setServerError("Could not get payment URL. Please try again.");
        return;
      }

      window.location.href = paystackUrl;
    } catch (err) {
      let message = "Payment initiation failed. Please try again.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || 
                  err.response?.data?.errors?.[0]?.message || 
                  message;
      }
      console.error("Payment error:", message);
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mt-[100px] flex flex-col items-center text-center p-6">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push("/product")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[50px] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {serverError}
          </div>
        )}

        {/* Order summary */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
              Order Summary
            </h3>
          </div>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.size && `Size: ${item.size.toUpperCase()}`}
                    {item.color && ` · ${item.color}`}
                    {` · Qty: ${item.quantity}`}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  ₦{(parseFloat(String(item.price)) * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
            <p className="font-semibold">Total</p>
            <p className="font-bold text-lg">₦{totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Currency */}
        <div className="mb-6">
          <label className="block text-sm mb-1 font-medium">Currency</label>
          <select
            value={currency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="NGN">NGN — Nigerian Naira</option>
            <option value="USD">USD — US Dollar</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-700 text-white px-4 py-3 rounded font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          {loading ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()} with Paystack`}
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          You will be redirected to Paystack to complete your payment securely.
        </p>
      </div>
    </div>
  );
}




// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import api from "@/app/lib/api/api.js";
// import { useAuth } from "../auth/AuthContext.js";

// export default function Checkout() {
//   const router = useRouter();
//   const { accessToken } = useAuth();
//   const cartItems = useSelector((state) => state.cart.cartItems);

//   const [currency, setCurrency] = useState("NGN");
//   const [serverError, setServerError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Parse price as number strictly — cart items may store price as string
//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

  

//   const handleSubmit = async (e) => {  
//     e.preventDefault();
//     setServerError("");

//     if (cartItems.length === 0) {
//       setServerError("Your cart is empty.");
//       return;
//     }

   
//     if (totalAmount > 10000000) { setServerError("Order total too large."); return; }

//     setLoading(true);

//     try {
//       const res = await api.post( "/payment/initiate",
//         {
//           amount: totalAmount,   
//           currency,              
//           provider: "PAYSTACK",
//           metadata: {
//   itemCount: String(cartItems.length),
//   totalAmount: String(totalAmount),
//   items: JSON.stringify(cartItems.map((item) => ({
//     id: item.id,
//     name: item.name,
//     quantity: item.quantity,
//     price: item.price,
//     size: item.size || null,
//     color: item.color || null,
//   }))),
// },
//         },
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );

//       const paystackUrl =
//         res.data.data?.authorizationUrl || res.data.data?.authorization_url;

//       if (!paystackUrl) {
//         setServerError("Could not get payment URL. Please try again.");
//         return;
//       }

//       window.location.href = paystackUrl;
//     } catch (err) {
//       // Log full error in dev to help debug
//       console.error("Payment error:", err.response?.data);
//       const message =
//         err.response?.data?.message ||
//         err.response?.data?.errors?.[0]?.message ||
//         "Payment initiation failed. Please try again.";
//       setServerError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="mt-[100px] flex flex-col items-center text-center p-6">
//         <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
//         <button onClick={() => router.push("/product")} className="bg-black text-white px-6 py-2 rounded">
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-[50px] flex items-center justify-center px-4">
//       <div className="max-w-md w-full p-6">
//         <h2 className="text-2xl font-bold mb-6">Checkout</h2>

//         {serverError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
//             {serverError}
//           </div>
//         )}

//         {/* Order summary */}
//         <div className="border rounded-lg overflow-hidden mb-6">
//           <div className="bg-gray-50 px-4 py-3 border-b">
//             <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
//               Order Summary
//             </h3>
//           </div>
//           <div className="divide-y">
//             {cartItems.map((item) => (
//               <div key={item.id} className="flex justify-between items-center px-4 py-3">
//                 <div>
//                   <p className="text-sm font-medium">{item.name}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     {item.size && `Size: ${item.size.toUpperCase()}`}
//                     {item.color && ` · ${item.color}`}
//                     {` · Qty: ${item.quantity}`}
//                   </p>
//                 </div>
//                 <p className="text-sm font-semibold">
//                   ₦{(parseFloat(item.price) * parseInt(item.quantity, 10)).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
//             <p className="font-semibold">Total</p>
//             <p className="font-bold text-lg">₦{totalAmount.toLocaleString()}</p>
//           </div>
//         </div>

//         {/* Currency */}
//         <div className="mb-6">
//           <label className="block text-sm mb-1 font-medium">Currency</label>
//           <select
//             value={currency}
//             onChange={(e) => setCurrency(e.target.value)}
//             className="w-full border p-2 rounded"
//           >
//             <option value="NGN">NGN — Nigerian Naira</option>
//             <option value="USD">USD — US Dollar</option>
//             <option value="GBP">GBP — British Pound</option>
//             <option value="EUR">EUR — Euro</option>
//           </select>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full bg-green-700 text-white px-4 py-3 rounded font-semibold disabled:opacity-50 hover:bg-gray-800 transition-colors"
//         >
//           {loading ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()} with Paystack`}
//         </button>

//         <p className="text-xs text-center text-gray-400 mt-3">
//           You will be redirected to Paystack to complete your payment securely.
//         </p>
//       </div>
//     </div>
//   );
// }