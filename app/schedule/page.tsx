"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Schedule() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();

      console.log("Order created:", data);

      // Reset form
      setForm({
        name: "",
        phone: "",
        address: "",
        service: "",
        notes: "",
      });

      // Redirect to confirmation page
      router.push("/order-confirmed");

    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Schedule Pickup</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          value={form.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          name="address"
          value={form.address}
          placeholder="Pickup Address"
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        >
          <option value="">Select Service</option>
          <option value="Dry Cleaning">Dry Cleaning</option>
          <option value="Laundry">Laundry</option>
          <option value="Ironing">Ironing</option>
        </select>

        <textarea
          name="notes"
          value={form.notes}
          placeholder="Additional notes"
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Schedule Pickup
        </button>

      </form>
    </main>
  );
}