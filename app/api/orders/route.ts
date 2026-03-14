import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const timestamp = new Date().toISOString();

    const newOrder = {
      name: body.name,
      phone: body.phone,
      address: body.address,
      service: body.service,
      notes: body.notes || "",
      status: "received",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await adminDb.collection("orders").add(newOrder);

    return NextResponse.json({
      message: "Order created",
      order: {
        id: docRef.id,
        ...newOrder,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone")?.trim();

    if (phone) {
      const snapshot = await adminDb
        .collection("orders")
        .where("phone", "==", phone)
        .get();

      const orders = snapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }))
        .sort((a: any, b: any) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

      return NextResponse.json({ orders });
    }

    const snapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    await adminDb.collection("orders").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Order updated",
      id,
      status,
    });
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}