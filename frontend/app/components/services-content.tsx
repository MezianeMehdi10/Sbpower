"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarClock,
  Check,
  Clock3,
  Home,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Store,
  Waves,
  Workflow,
} from "lucide-react";
import { useEffect, type CSSProperties } from "react";
import { getServiceKey, servicesByLocale } from "@/app/lib/translations";
import { useLanguage } from "./language-provider";

const serviceIcons = [Building2, Workflow, Stethoscope, Store, Waves, Sparkles, Home, MapPin, Clock3];
const serviceAnchors = [
  "gebaeudereinigung",
  "bueroreinigung",
  "praxisreinigung",
  "geschaeftsreinigung",
  "treppenhausreinigung",
  "sanitaerreinigung",
  "privathaushalt",
  "eingangsreinigung",
  "unterhaltsreinigung",
];

const featureImages = [
  "/images/services/gebaeudereinigung.webp",
  "/images/hero-office.png",
  "/images/services/praxisreinigung.webp",
  "/images/services/geschaeftsreinigung.webp",
];

export function ServicesContent() {
  const { copy, locale } = useLanguage();
  const services = servicesByLocale[locale];

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-services-reveal]");
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
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="services-page">
      <section className="services-hero" aria-labelledby="services-title">
        <Image className="services-hero-image" src="/images/services/services-hero.webp" alt={copy.servicesPage.heroImageAlt} fill priority sizes="100vw" />
        <div className="services-hero-overlay" aria-hidden="true" />
        <div className="container services-hero-inner">
          <div className="services-hero-copy">
            <span className="eyebrow eyebrow-light">{copy.servicesPage.eyebrow}</span>
            <h1 id="services-title">{copy.servicesPage.title}</h1>
            <p>{copy.servicesPage.subtitle}</p>
            <div className="button-row">
              <Link className="button button-light" href="#services-overview">{copy.servicesPage.heroPrimary}<ArrowDown aria-hidden="true" /></Link>
              <Link className="button button-outline-light" href="/kontakt#anfrage">{copy.servicesPage.heroSecondary}<ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services-overview-section" id="services-overview" data-services-reveal>
        <div className="container">
          <header className="section-heading services-overview-heading">
            <span className="eyebrow">SB Power</span>
            <h2>{copy.servicesPage.overviewTitle}</h2>
            <p>{copy.servicesPage.overviewText}</p>
          </header>
          <div className="services-overview-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <Link className="services-overview-card" href={`#${serviceAnchors[index]}`} key={service[0]} style={{ "--service-delay": `${120 + index * 65}ms` } as CSSProperties}>
                  <span className="services-overview-icon"><Icon aria-hidden="true" /></span>
                  <span className="services-overview-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{service[0]}</h3>
                  <p>{service[1]}</p>
                  <span className="services-overview-arrow" aria-hidden="true"><ArrowRight /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {([0, 1, 2, 3] as const).map((index) => {
        const service = services[index];
        const reverse = index % 2 === 1;
        return (
          <section className={`services-feature-section ${reverse ? "is-reverse" : ""} ${index === 2 ? "is-tinted" : ""}`} id={serviceAnchors[index]} data-services-reveal key={service[0]} aria-labelledby={`service-title-${index}`}>
            <div className="container services-feature-grid">
              <div className="services-feature-media">
                <Image src={featureImages[index]} alt={service[0]} fill sizes="(max-width: 760px) 100vw, 50vw" />
              </div>
              <div className="services-feature-copy">
                <span className="services-feature-number">{String(index + 1).padStart(2, "0")}</span>
                <h2 id={`service-title-${index}`}>{service[0]}</h2>
                <p className="services-feature-lead">{service[1]}</p>
                <p>{service[2]}</p>
                <h3>{copy.servicesPage.suitable}</h3>
                <ul className="services-pill-list">{service[3].map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
                <Link className="services-request-link" href={`/kontakt?service=${getServiceKey(index)}#anfrage`}>{copy.servicesPage.requestService}<ArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </section>
        );
      })}

      <section className="services-double-section" data-services-reveal>
        <div className="container services-double-grid">
          {[4, 7].map((index, cardIndex) => {
            const service = services[index];
            const image = cardIndex === 0 ? "/images/services/treppenhaus.webp" : "/images/services/gebaeudereinigung.webp";
            return (
              <article className="services-image-card" id={serviceAnchors[index]} key={service[0]}>
                <Image src={image} alt={service[0]} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <div className="services-image-card-overlay" aria-hidden="true" />
                <div className="services-image-card-copy">
                  <span>{String(index + 1).padStart(2, "0")}</span><h2>{service[0]}</h2><p>{service[2]}</p>
                  <Link href={`/kontakt?service=${getServiceKey(index)}#anfrage`}>{copy.servicesPage.requestService}<ArrowRight aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-sanitary-section" id="sanitaerreinigung" data-services-reveal aria-labelledby="sanitary-title">
        <div className="container services-sanitary-grid">
          <div className="services-sanitary-copy">
            <span className="services-feature-number">06</span>
            <h2 id="sanitary-title">{services[5][0]}</h2>
            <p className="services-feature-lead">{services[5][1]}</p><p>{services[5][2]}</p>
            <ul className="services-dark-list">{services[5][3].map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
            <Link className="button button-light" href={`/kontakt?service=${getServiceKey(5)}#anfrage`}>{copy.servicesPage.requestService}<ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="services-sanitary-media"><Image src="/images/services/sanitaerreinigung.webp" alt={services[5][0]} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
        </div>
      </section>

      <section className="services-feature-section services-private-section" id="privathaushalt" data-services-reveal aria-labelledby="private-service-title">
        <div className="container services-feature-grid">
          <div className="services-feature-media"><Image src="/images/services/privathaushalt.webp" alt={services[6][0]} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
          <div className="services-feature-copy">
            <span className="services-feature-number">07</span><p className="services-secondary-title">{services[6][0]}</p>
            <h2 id="private-service-title">{copy.servicesPage.privateHeadline}</h2>
            <p className="services-feature-lead">{services[6][1]}</p><p>{services[6][2]}</p>
            <ul className="services-pill-list">{services[6][3].map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
            <Link className="services-request-link" href="/kontakt?type=privat&service=private-household#anfrage">{copy.servicesPage.privateCta}<ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="services-feature-section is-reverse is-tinted services-maintenance-section" id="unterhaltsreinigung" data-services-reveal aria-labelledby="maintenance-title">
        <div className="container services-feature-grid">
          <div className="services-feature-media"><Image src="/images/services/unterhaltsreinigung.webp" alt={services[8][0]} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
          <div className="services-feature-copy">
            <span className="services-feature-number">09</span><p className="services-secondary-title">{services[8][0]}</p>
            <h2 id="maintenance-title">{copy.servicesPage.maintenanceHeadline}</h2>
            <p className="services-feature-lead">{services[8][1]}</p>
            <div className="services-mini-steps">
              {[SlidersHorizontal, Check, CalendarClock].map((Icon, index) => <div key={copy.servicesPage.maintenanceSteps[index]}><span><Icon aria-hidden="true" /></span><strong>0{index + 1}</strong><p>{copy.servicesPage.maintenanceSteps[index]}</p></div>)}
            </div>
            <Link className="services-request-link" href={`/kontakt?service=${getServiceKey(8)}#anfrage`}>{copy.servicesPage.requestService}<ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="services-audience-section" data-services-reveal>
        <div className="container">
          <header className="services-dark-heading"><span className="eyebrow eyebrow-light">SB Power</span><h2>{copy.servicesPage.audienceTitle}</h2><p>{copy.servicesPage.audienceText}</p></header>
          <div className="services-audience-grid">
            <article><span className="services-audience-icon"><Home aria-hidden="true" /></span><h3>{copy.servicesPage.privateCustomersTitle}</h3><ul>{copy.servicesPage.privateCustomers.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></article>
            <article><span className="services-audience-icon"><Building2 aria-hidden="true" /></span><h3>{copy.servicesPage.businessCustomersTitle}</h3><ul>{copy.servicesPage.businessCustomers.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></article>
          </div>
        </div>
      </section>

      <section className="services-quality-section" data-services-reveal>
        <div className="container">
          <div className="services-quality-panel">
            <Image src="/images/services/detail-cleaning.webp" alt={copy.servicesPage.qualityImageAlt} fill sizes="(max-width: 760px) 100vw, 1200px" />
            <div className="services-quality-overlay" aria-hidden="true" />
            <div className="services-quality-copy"><h2>{copy.servicesPage.qualityTitle}</h2><p>{copy.servicesPage.qualityText}</p><ul>{copy.servicesPage.qualities.map((item) => <li key={item}><Sparkles aria-hidden="true" />{item}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="services-final-section" data-services-reveal>
        <div className="container">
          <div className="services-final-panel">
            <span className="services-final-line" aria-hidden="true" /><span className="eyebrow eyebrow-light">SB Power Bremen</span>
            <h2>{copy.servicesPage.finalTitle}</h2><p>{copy.servicesPage.finalText}</p>
            <div className="button-row"><Link className="button button-light" href="/kontakt#anfrage">{copy.servicesPage.finalPrimary}<ArrowRight aria-hidden="true" /></Link><Link className="button button-outline-light" href="/kontakt">{copy.servicesPage.finalSecondary}</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
