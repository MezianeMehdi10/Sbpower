"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";
import { Locale, locales } from "@/app/lib/translations";

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale, copy } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    ["/", copy.nav.home],
    ["/leistungen", copy.nav.services],
    ["/kontakt", copy.nav.contact],
  ];

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo-link" aria-label="SB Power">
          <Image src="/images/logo2.png" alt="SB Power Gebäudeservice" width={240} height={160} priority />
        </Link>

        <button className="menu-button" type="button" aria-label={open ? copy.nav.closeMenu : copy.nav.menu} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div className={`header-panel ${open ? "is-open" : ""}`} id="main-navigation">
          <nav className="main-nav" aria-label="Main navigation">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={pathname === href ? "is-active" : ""} onClick={() => setOpen(false)}>{label}</Link>
            ))}
          </nav>
          <div className="language-switcher" aria-label={copy.nav.language}>
            {locales.map((item) => (
              <button key={item} type="button" className={locale === item ? "is-active" : ""} aria-pressed={locale === item} onClick={() => setLocale(item as Locale)}>{item.toUpperCase()}</button>
            ))}
          </div>
          <Link className="button button-primary header-cta" href="/kontakt#anfrage" onClick={() => setOpen(false)}>
            <span className="header-cta-icon"><Phone aria-hidden="true" /></span>
            {copy.nav.cta}
            <ArrowRight className="header-cta-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="header-waves" aria-hidden="true">
        <svg viewBox="0 0 1440 184" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="header-surface" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.72" stopColor="#fbfdff" />
              <stop offset="1" stopColor="#eaf6ff" />
            </linearGradient>
            <linearGradient id="header-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0066bb" />
              <stop offset="0.5" stopColor="#11b6ff" />
              <stop offset="1" stopColor="#0068c2" />
            </linearGradient>
          </defs>
          <path className="header-wave-base" d="M0 0H1440V82C1090 177 430 184 0 72Z" />
          <path className="header-wave-ribbon" d="M0 45C350 164 1040 178 1440 62V89C1060 194 360 194 0 73Z" />
          <path className="header-wave-surface" d="M0 0H1440V72C1060 177 420 186 0 61Z" />
          <path className="header-wave-left-back" d="M0 0H130C300 82 505 126 770 143C480 145 205 96 0 31Z" />
          <path className="header-wave-left-front" d="M0 18C210 91 445 134 716 147C423 132 190 85 0 45Z" />
          <path className="header-wave-right-back" d="M1440 0H1288C1140 86 980 126 770 143C1034 141 1260 94 1440 27Z" />
          <path className="header-wave-right-front" d="M1440 28C1260 91 1050 132 808 146C1050 137 1265 98 1440 52Z" />
          <path className="header-wave-highlight" d="M0 61C420 186 1060 177 1440 72" />
          <path className="header-wave-line" d="M0 73C360 194 1060 194 1440 89" />
        </svg>
      </div>
    </header>
  );
}
