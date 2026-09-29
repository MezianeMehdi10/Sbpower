import type { Metadata } from "next";
import { ContactContent } from "@/app/components/contact-content";

export const metadata: Metadata = {
  title: "Contact / Kontakt | SB Power Bremen",
  description: "Contact SB Power for an individual cleaning inquiry in Bremen and the surrounding area.",
  alternates: { canonical: "/kontakt" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ type?: string; service?: string }> }) {
  const params = await searchParams;
  return <ContactContent initialType={params.type} initialService={params.service} />;
}
