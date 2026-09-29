import type { Metadata } from "next";
import { LegalContent } from "@/app/components/legal-content";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };
export default function ImprintPage() { return <LegalContent type="imprint" />; }
