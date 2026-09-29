import type { Metadata } from "next";
import { LegalContent } from "@/app/components/legal-content";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };
export default function PrivacyPage() { return <LegalContent type="privacy" />; }
