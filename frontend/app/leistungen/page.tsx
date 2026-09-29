import type { Metadata } from "next";
import { ServicesContent } from "@/app/components/services-content";

export const metadata: Metadata = {
  title: "Services / Reinigungsleistungen in Bremen",
  description: "SB Power cleaning services in Bremen: offices, practices, businesses, homes and buildings.",
  alternates: { canonical: "/leistungen" },
};

export default function ServicesPage() { return <ServicesContent />; }
