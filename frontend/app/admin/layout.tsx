import type { Metadata } from "next";
import "./admin.css";
import { AdminLanguageProvider } from "@/app/components/admin-language-provider";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLanguageProvider>{children}</AdminLanguageProvider>;
}
