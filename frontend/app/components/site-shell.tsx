"use client";

import { Footer } from "./footer";
import { Header } from "./header";
import { LanguageProvider } from "./language-provider";
import { usePathname } from "next/navigation";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return <LanguageProvider>{isAdminRoute ? children : <><Header />{children}<Footer /></>}</LanguageProvider>;
}
