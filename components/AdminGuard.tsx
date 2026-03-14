"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() || "";
  const userEmail = user?.email?.toLowerCase() || "";
  const isAdmin = !!user && userEmail === adminEmail;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!isAdmin) {
      signOut(auth).finally(() => {
        router.replace("/admin/login?error=unauthorized");
      });
    }
  }, [loading, user, isAdmin, router, pathname]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </main>
    );
  }

  if (!user || !isAdmin) return null;

  return <>{children}</>;
}