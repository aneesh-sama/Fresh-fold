"use client";

import { useState } from "react";

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

function formatStatus(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();

    const cleanedPhone = phone.trim();

    if (!cleanedPhone) {
      setSearched(true);
      setOrders([]);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/orders?phone=${encodeURIComponent(cleanedPhone)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Track fetch error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your phone number to check your order status.
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Track
            </button>
          </div>
        </form>

        {searched && loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-gray-600">Searching orders...</p>
          </div>
        )}

        {searched && !loading && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-gray-600">No orders found for this phone number.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {order.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Service: {order.service}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Created: {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Updated: {formatDate(order.updatedAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-800">
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Phone:</span>{" "}
                    {order.phone}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Address:</span>{" "}
                    {order.address}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Notes:</span>{" "}
                    {order.notes || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}