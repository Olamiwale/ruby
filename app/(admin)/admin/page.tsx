"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/features/auth/AuthContext";
import api from "../../lib/api/api.js";

// ── Types ──────────────────────────────────────────────────────────────────

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  productName: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface Payment {
  amount: string | number;
  currency?: string;
  status: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount?: string | number;
  items: OrderItem[];
  payment?: Payment;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

// ── Constants ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED:    "bg-purple-100 text-purple-800",
  DELIVERED:  "bg-green-100 text-green-800",
  COMPLETED:  "bg-green-100 text-green-800",
  CANCELLED:  "bg-red-100 text-red-800",
};

const VALID_STATUSES: OrderStatus[] = [
  "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatAmount(amount: string | number | undefined, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status as OrderStatus] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`${cls} text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
      {status}
    </span>
  );
}

// ── Orders Tab ─────────────────────────────────────────────────────────────

function OrdersTab({ accessToken }: { accessToken: string | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(res.data.data);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchOrders();
  }, [accessToken]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await api.patch(
        `/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: res.data.data.status } : o)
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-400">Loading orders...</div>;
  if (error)   return <div className="py-12 text-center text-red-400">{error}</div>;
  if (orders.length === 0) return <div className="py-12 text-center text-gray-400">No orders yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-gray-400">
            <th className="text-left py-3 px-4">Customer</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Items</th>
            <th className="text-left py-3 px-4">Amount</th>
            <th className="text-left py-3 px-4">Payment</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-stone-50 transition-colors">

              {/* Customer */}
              <td className="py-4 px-4">
                <p className="font-medium text-gray-900">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{order.user?.email}</p>
              </td>

              {/* Date */}
              <td className="py-4 px-4 text-gray-600">{formatDate(order.createdAt)}</td>

              {/* Items */}
              <td className="py-4 px-4">
                {order.items?.length > 0 ? (
                  <ul className="space-y-0.5">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-gray-600">
                        <p><span className="font-bold">Dress: </span>{item.productName}</p>
                        <p><span className="font-bold">Quantity: </span>{item.quantity}</p>
                        <p><span className="font-bold">Size: </span>{item.size?.toUpperCase()}</p>
                        <p><span className="font-bold">Color: </span>{item.color}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400 italic text-xs">No items recorded</span>
                )}
              </td>

              {/* Amount */}
              <td className="py-4 px-4 font-semibold text-gray-900">
                {order.payment
                  ? formatAmount(order.payment.amount, order.payment.currency)
                  : formatAmount(order.totalAmount)}
              </td>

              {/* Payment status */}
              <td className="py-4 px-4">
                {order.payment
                  ? <StatusBadge status={order.payment.status} />
                  : <span className="text-gray-400 text-xs">—</span>
                }
              </td>

              {/* Order status */}
              <td className="py-4 px-4">
                <StatusBadge status={order.status} />
              </td>

              {/* Update dropdown */}
              <td className="py-4 px-4">
                <select
                  value={order.status}
                  disabled={updating === order.id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white disabled:opacity-50 cursor-pointer"
                >
                  {VALID_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Customers Tab ──────────────────────────────────────────────────────────

function CustomersTab({ accessToken }: { accessToken: string | null }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/admin/customers", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCustomers(res.data.data);
      } catch {
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchCustomers();
  }, [accessToken]);

  if (loading) return <div className="py-12 text-center text-gray-400">Loading customers...</div>;
  if (error)   return <div className="py-12 text-center text-red-400">{error}</div>;
  if (customers.length === 0) return <div className="py-12 text-center text-gray-400">No customers yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase tracking-widest text-gray-400">
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Joined</th>
            <th className="text-left py-3 px-4">Orders</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-stone-50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {customer.firstName?.[0]}{customer.lastName?.[0]}
                  </div>
                  <span className="font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600">{customer.email}</td>
              <td className="py-4 px-4 text-gray-600">{formatDate(customer.createdAt)}</td>
              <td className="py-4 px-4">
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {customer._count?.orders ?? 0} order{customer._count?.orders !== 1 ? "s" : ""}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────────────────────

export default function AdminPage() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<"orders" | "customers">("orders");

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-10 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gray-900 rounded-2xl px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">Dashboard</p>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full tracking-widest uppercase">
            mapbyruby
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["orders", "customers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                tab === t
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {tab === "orders"
            ? <OrdersTab accessToken={accessToken} />
            : <CustomersTab accessToken={accessToken} />
          }
        </div>

      </div>
    </div>
  );
}

