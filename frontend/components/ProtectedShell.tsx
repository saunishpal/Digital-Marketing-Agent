"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/auth";
import { canAccessPath } from "@/lib/access";

export default function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (!user.is_active) {
      router.replace("/login");
      return;
    }

    if (!canAccessPath(user.role, user.package_name, pathname)) {
      router.replace("/dashboard");
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-400">
        Checking access...
      </main>
    );
  }

  return <>{children}</>;
}