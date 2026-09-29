"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { companyContact } from "@/app/lib/company-contact";
import { servicesByLocale } from "@/app/lib/translations";
import { useLanguage } from "./language-provider";

const mapUrl = "https://www.google.com/maps/search/?api=1&query=Schwarzer%20Weg%2052A%2C%2028239%20Bremen%2C%20Germany";
const footerServiceIndexes = [0, 1, 2, 6];

export function Footer() {
  const { copy, locale } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const services = servicesByLocale[locale];

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      footer.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      footer.classList.add("is-visible");
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="container footer-grid">
        <div className="footer-column footer-brand" style={{ "--footer-delay": "0ms" } as CSSProperties}>
          <Image src="/images/logo2.png" alt="SB Power Gebäudeservice" width={190} height={126} />
          <div className="footer-brand-name"><strong>SB Power</strong><span>Gebäudereinigung</span></div>
          <p>{copy.footer.tagline}</p>
          <p className="muted-light">{copy.footer.description}</p>
        </div>
        <div className="footer-column footer-links" style={{ "--footer-delay": "80ms" } as CSSProperties}>
          <h2>{copy.footer.links}</h2>
          <Link href="/">{copy.nav.home}</Link>
          <Link href="/leistungen">{copy.nav.services}</Link>
          <Link href="/kontakt">{copy.nav.contact}</Link>
        </div>
        <div className="footer-column footer-links" style={{ "--footer-delay": "140ms" } as CSSProperties}>
          <h2>{copy.footer.services}</h2>
          {footerServiceIndexes.map((index) => <Link href="/leistungen" key={services[index][0]}>{services[index][0]}</Link>)}
        </div>
        <div className="footer-column footer-contact" style={{ "--footer-delay": "200ms" } as CSSProperties}>
          <h2>{copy.footer.contact}</h2>
          <div className="footer-address"><MapPin aria-hidden="true" /><span>{copy.footer.locationStreet}<br />{copy.footer.locationCity}</span></div>
          <a className="footer-contact-link" href={companyContact.phoneUrl}><Phone aria-hidden="true" /><span><small>Telefon</small>{companyContact.phoneDisplay}</span></a>
          <a className="footer-contact-link" href={companyContact.emailUrl}><Mail aria-hidden="true" /><span><small>E-Mail</small>{companyContact.email}</span></a>
          <a className="footer-map-link" href={mapUrl} target="_blank" rel="noopener noreferrer">{copy.footer.maps}<ExternalLink aria-hidden="true" /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{copy.footer.rights}</span>
        <nav aria-label={copy.footer.legal}>
          <Link href="/impressum">{copy.footer.imprint}</Link>
          <Link href="/datenschutz">{copy.footer.privacy}</Link>
          <Link href="/datenschutz#cookie-settings">{copy.footer.cookies}</Link>
        </nav>
      </div>
    </footer>
  );
}
