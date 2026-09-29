"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { AdminUser, logoutAdmin } from "@/app/lib/admin-api";
import { AdminLanguageSwitcher, useAdminLanguage } from "./admin-language-provider";

export function AdminShell({ user, children }: { user: AdminUser; children: ReactNode }) {
  const router = useRouter();
  const { copy } = useAdminLanguage();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLogoutFailed(false);
    setLoggingOut(true);
    try {
      await logoutAdmin();
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      if ((error as { status?: number }).status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      setLogoutFailed(true);
      setLoggingOut(false);
    }
  }

  return <div className="admin-app">
    <header className="admin-header"><div className="admin-header-inner">
      <Link className="admin-brand" href="/admin/requests"><Image src="/images/logo2.png" alt="SB Power" width={112} height={74} priority /><span><strong>SB Power</strong><small>{copy.administration}</small></span></Link>
      <div className="admin-user"><span>{user.name}</span><AdminLanguageSwitcher /><button type="button" onClick={handleLogout} disabled={loggingOut}><LogOut aria-hidden="true" />{loggingOut ? copy.loggingOut : copy.logout}</button></div>
    </div></header>
    {logoutFailed ? <div className="admin-shell-notice" role="alert">{copy.logoutError}</div> : null}
    {children}
  </div>;
}

export function AdminLoading() {
  const { copy } = useAdminLanguage();
  return <main className="admin-loading" aria-busy="true"><span className="admin-loader" /><p>{copy.loading}</p></main>;
}
