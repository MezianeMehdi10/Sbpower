import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "./components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "SB Power | Cleaning Service Bremen", template: "%s | SB Power" },
  description: "SB Power provides professional cleaning services for private and business customers in Bremen and the surrounding area.",
  icons: { icon: "/images/logo.jpeg" },
  openGraph: { siteName: "SB Power Gebäudereinigung", locale: "de_DE", type: "website", images: [{ url: "/images/logo.jpeg", width: 1254, height: 1254, alt: "SB Power Gebäudereinigung" }] },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
