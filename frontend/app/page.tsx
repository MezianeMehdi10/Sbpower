import type { Metadata } from "next";
import { HomeContent } from "./components/home-content";

export const metadata: Metadata = {
  title: "SB Power | Cleaning Service Bremen | Reinigung für Privat & Gewerbe",
  description: "Professional cleaning services for private and business customers in Bremen and the surrounding area.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeContent />;
}
