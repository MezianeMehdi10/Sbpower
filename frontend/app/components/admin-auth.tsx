"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminUser, getAdminSession } from "@/app/lib/admin-api";

export function useAdminGuard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminSession().then((session) => {
      if (!active) return;
      if (!session.authenticated || !session.user) {
        router.replace("/admin/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    }).catch(() => {
      if (active) router.replace("/admin/login");
    });
    return () => { active = false; };
  }, [router]);

  return { user, loading };
}
