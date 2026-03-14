"use client";

import Link from "next/link";

export default function OrderConfirmedPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">

        <div className="text-5xl mb-4">✅</div>

        <h1 className="text-2xl font-bold text-gray-900">
          Order Confirmed
        </h1>

        <p className="mt-3 text-gray-600 text-sm">
          Your laundry pickup request has been received.
          Our team will process it shortly.
        </p>

        <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
          <p>
            You can track your order anytime using your phone number.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">

        <Link
        href="/track"
        className="block w-full bg-black !text-white text-center py-3 rounded-xl font-medium hover:opacity-90"
        >
        Track Your Order
        </Link>

        <Link
            href="/"
            className="block w-full border border-gray-300 py-3 rounded-xl text-center font-medium hover:bg-gray-50"
        >
            Back to Home
        </Link>

        </div>
      </div>
    </main>
  );
}