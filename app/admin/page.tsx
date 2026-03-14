"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import AdminGuard from "@/components/AdminGuard";
import { signOut } from "firebase/auth";

type OrderStatus =
  | "received"
  | "picked_up"
  | "cleaning"
  | "out_for_delivery"
  | "delivered";

type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  service: string;
  notes: string;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
};

const STATUS_OPTIONS: OrderStatus[] = [
  "received",
  "picked_up",
  "cleaning",
  "out_for_delivery",
  "delivered",
];

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const liveOrders: Order[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();

            let createdAt = "";
            let updatedAt = "";

            const rawCreatedAt = data.createdAt;
            const rawUpdatedAt = data.updatedAt;

            if (rawCreatedAt instanceof Timestamp) {
              createdAt = rawCreatedAt.toDate().toISOString();
            } else if (
              rawCreatedAt &&
              typeof rawCreatedAt === "object" &&
              typeof rawCreatedAt.toDate === "function"
            ) {
              createdAt = rawCreatedAt.toDate().toISOString();
            } else if (typeof rawCreatedAt === "string") {
              createdAt = rawCreatedAt;
            }

            if (rawUpdatedAt instanceof Timestamp) {
              updatedAt = rawUpdatedAt.toDate().toISOString();
            } else if (
              rawUpdatedAt &&
              typeof rawUpdatedAt === "object" &&
              typeof rawUpdatedAt.toDate === "function"
            ) {
              updatedAt = rawUpdatedAt.toDate().toISOString();
            } else if (typeof rawUpdatedAt === "string") {
              updatedAt = rawUpdatedAt;
            }

            return {
              id: docSnap.id,
              name: data.name ?? "",
              phone: data.phone ?? "",
              address: data.address ?? "",
              service: data.service ?? "",
              notes: data.notes ?? "",
              status: (data.status as OrderStatus) ?? "received",
              createdAt,
              updatedAt,
            };
          });

          setOrders(liveOrders);
          setLoading(false);
        },
        (error) => {
          console.error("Realtime admin listener error:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });

    return () => unsubAuth();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      setUpdatingId(orderId);

      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  const filteredOrders = useMemo(() => {
    if (filter === "active") {
      return orders.filter((o) => o.status !== "delivered");
    }

    if (filter === "delivered") {
      return orders.filter((o) => o.status === "delivered");
    }

    return orders;
  }, [orders, filter]);

  const hasOrders = filteredOrders.length > 0;

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Orders update live from Firestore.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          {/* FILTER BUTTONS */}

          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "all"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              All Orders
            </button>

            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "active"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              Active Orders
            </button>

            <button
              onClick={() => setFilter("delivered")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "delivered"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              Delivered
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : !hasOrders ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr className="text-sm text-gray-700">
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Address</th>
                      <th className="px-4 py-3 font-semibold">Service</th>
                      <th className="px-4 py-3 font-semibold">Notes</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 font-semibold">Updated</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-200 align-top"
                      >
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {order.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.phone}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.address}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.service}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {order.notes || "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatDate(order.updatedAt)}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-black"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}