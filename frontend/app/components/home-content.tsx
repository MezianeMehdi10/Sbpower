"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  HeartHandshake,
  Home,
  MapPin,
  Navigation,
  Sparkles,
  Stethoscope,
  Store,
  Waves,
  Workflow,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, type CSSProperties } from "react";
import { getServiceKey, servicesByLocale } from "@/app/lib/translations";
import { useLanguage } from "./language-provider";

const serviceIcons = [
  Building2,
  Workflow,
  Stethoscope,
  Store,
  Waves,
  Sparkles,
  Home,
  MapPin,
  Clock3,
];

const whyIcons = [HeartHandshake, SlidersHorizontal, Building2, MapPin];
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Schwarzer%20Weg%2052A%2C%2028239%20Bremen%2C%20Germany";

function AccentTitle({ title }: { title: string }) {
  const words = title.trim().split(" ");
  const accent = words.pop();
  return <>{words.length ? `${words.join(" ")} ` : null}<span>{accent}</span></>;
}

export function HomeContent() {
  const { copy, locale } = useLanguage();
  const services = servicesByLocale[locale];

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-home-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.16 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="premium-hero" aria-labelledby="premium-hero-title">
        <Image
          className="premium-hero-image"
          src="/images/hero-office.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="premium-hero-overlay" aria-hidden="true" />

        <div className="premium-hero-shell">
          <div className="premium-glass-panel">
            <header className="premium-panel-heading">
              <span className="premium-kicker">SB Power · Bremen</span>
              <h1 id="premium-hero-title"><AccentTitle title={copy.home.servicesTitle} /></h1>
              <span className="premium-title-rule" aria-hidden="true" />
              <p>{copy.home.premiumSubtitle}</p>
            </header>

            <div className="premium-service-list" aria-label={copy.home.servicesTitle}>
              {services.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <Link
                    className="premium-service-row"
                    href={`/kontakt?service=${getServiceKey(index)}#anfrage`}
                    key={service[0]}
                    style={{ animationDelay: `${220 + index * 55}ms` }}
                  >
                    <span className="premium-service-icon"><Icon aria-hidden="true" /></span>
                    <span>{service[0]}</span>
                    <ChevronRight aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            <div className="premium-panel-divider" />

            <div className="premium-audience">
              <header>
                <h2><AccentTitle title={copy.home.audienceTitle} /></h2>
                <p>{copy.home.audienceText}</p>
              </header>
              <ul>
                {copy.home.audiences.map((item, index) => (
                  <li key={item} style={{ animationDelay: `${620 + index * 45}ms` }}>
                    <span><Check aria-hidden="true" /></span>{item}
                  </li>
                ))}
              </ul>
            </div>

            <Link className="premium-scroll-cue" href="#home-more" aria-label={copy.home.privateTitle}>
              <ArrowDown aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section customer-section" data-home-reveal id="home-more">
        <div className="container customer-grid">
          <article className="customer-panel private">
            <span className="customer-panel-icon"><Home aria-hidden="true" /></span>
            <h2>{copy.home.privateTitle}</h2>
            <p>{copy.home.privateText}</p>
            <Link className="customer-panel-cta" href="/kontakt?type=privat#anfrage">{copy.home.privateCta}<ArrowRight aria-hidden="true" /></Link>
          </article>
          <article className="customer-panel business">
            <span className="customer-panel-icon"><Building2 aria-hidden="true" /></span>
            <h2>{copy.home.businessTitle}</h2>
            <p>{copy.home.businessText}</p>
            <Link className="customer-panel-cta" href="/kontakt?type=unternehmen#anfrage">{copy.home.businessCta}<ArrowRight aria-hidden="true" /></Link>
          </article>
        </div>
      </section>

      <section className="section why-section" data-home-reveal>
        <div className="container">
          <div className="section-heading why-heading">
            <span className="eyebrow">SB Power</span>
            <h2>{copy.home.whyTitle}</h2>
          </div>
          <div className="why-grid">
            <span className="why-connector" aria-hidden="true" />
            {copy.home.why.map(([title, text], index) => {
              const Icon = whyIcons[index];
              return (
                <article className="why-card" key={title} style={{ "--why-delay": `${320 + index * 120}ms` } as CSSProperties}>
                  <div className="why-card-top">
                    <span className="why-number">0{index + 1}</span>
                    <span className="why-icon"><Icon aria-hidden="true" /></span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section location-section" data-home-reveal>
        <div className="container location-shell">
          <header className="section-heading location-heading">
            <span className="eyebrow">{copy.home.locationEyebrow}</span>
            <h2>{copy.home.locationTitle}</h2>
            <p>{copy.home.locationSubtitle}</p>
          </header>
          <div className="location-grid">
            <a className="map-preview" href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.home.locationMapLabel}>
              <Image src="/images/sb-power-map-schwarzer-weg.png" alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />
              <span className="map-preview-shade" aria-hidden="true" />
              <span className="map-badge"><MapPin aria-hidden="true" />{copy.home.locationMapBadge}</span>
              <span className="map-open-label">{copy.home.locationMapCta}<ExternalLink aria-hidden="true" /></span>
            </a>
            <article className="location-info-card">
              <div className="location-info-block">
                <span className="location-info-icon"><MapPin aria-hidden="true" /></span>
                <div><span className="location-info-label">{copy.home.locationCardTitle}</span><strong>{copy.footer.locationStreet}</strong><p>{copy.footer.locationCity}</p></div>
              </div>
              <div className="location-info-block">
                <span className="location-info-icon"><Navigation aria-hidden="true" /></span>
                <div><span className="location-info-label">{copy.home.locationAreaTitle}</span><p>{copy.home.locationAreaText}</p></div>
              </div>
              <div className="location-actions">
                <a className="button button-primary location-route-button" href={mapUrl} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden="true" />{copy.home.locationRouteCta}<ArrowRight aria-hidden="true" /></a>
                <Link className="button button-secondary" href="/kontakt#anfrage">{copy.home.locationContactCta}</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="local-cta-section" data-home-reveal>
        <div className="container">
          <div className="local-cta-panel">
            <span className="local-cta-wave local-cta-wave-one" aria-hidden="true" />
            <span className="local-cta-wave local-cta-wave-two" aria-hidden="true" />
            <span className="eyebrow eyebrow-light">{copy.home.finalEyebrow}</span>
            <h2>{copy.home.finalTitle}</h2>
            <p>{copy.home.finalText}</p>
            <div className="button-row">
              <Link className="button button-light" href="/kontakt#anfrage">{copy.home.finalPrimary}<ArrowRight aria-hidden="true" /></Link>
              <Link className="button button-outline-light" href="/leistungen">{copy.home.finalSecondary}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
