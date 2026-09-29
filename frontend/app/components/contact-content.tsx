"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2, Mail, MessageCircle, Phone, RotateCcw, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { companyContact } from "@/app/lib/company-contact";
import { contactPageTranslations } from "@/app/lib/contact-copy";
import { getServiceKey, servicesByLocale } from "@/app/lib/translations";
import { useLanguage } from "./language-provider";

type ContactContentProps = { initialType?: string; initialService?: string };
type FieldErrors = Partial<Record<"name" | "service" | "contact" | "email" | "privacy_accepted", string>>;
type FormState = typeof emptyForm;

const emptyForm = { name: "", phone: "", email: "", service: "", message: "", privacy_accepted: false, website: "" };

export function ContactContent({ initialService }: ContactContentProps) {
  const { copy, locale } = useLanguage();
  const text = contactPageTranslations[locale];
  const services = servicesByLocale[locale];
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  const validInitialService = initialService && [...services.map((_, index) => getServiceKey(index)), "other"].includes(initialService) ? initialService : "";
  const [form, setForm] = useState<FormState>(() => ({ ...emptyForm, service: validInitialService }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-contact-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function update(name: keyof FormState, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    if (name in errors || name === "phone") setErrors((current) => ({ ...current, [name]: undefined, contact: undefined }));
    if (name === "email") setErrors((current) => ({ ...current, email: undefined, contact: undefined }));
    if (status === "error") setStatus("idle");
  }

  function focusFirstError(next: FieldErrors) {
    const target = next.name ? nameRef.current : next.service ? serviceRef.current : next.contact ? (phoneRef.current ?? emailRef.current) : next.email ? emailRef.current : next.privacy_accepted ? privacyRef.current : null;
    target?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = text.errorName;
    if (!form.service) next.service = text.errorService;
    if (!form.phone.trim() && !form.email.trim()) next.contact = text.errorContact;
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = text.errorEmail;
    if (!form.privacy_accepted) next.privacy_accepted = text.errorPrivacy;
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }
    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/inquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: locale }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const next: FieldErrors = {};
        if (result.name) next.name = text.errorName;
        if (result.service) next.service = text.errorService;
        if (result.contact) next.contact = text.errorContact;
        if (result.email) next.email = text.errorEmail;
        if (result.privacy_accepted) next.privacy_accepted = text.errorPrivacy;
        setErrors(next);
        setStatus("error");
        focusFirstError(next);
        return;
      }
      setForm(emptyForm);
      setErrors({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const directContacts = [
    { key: "whatsapp", icon: MessageCircle, title: text.whatsappTitle, description: text.whatsappText, display: companyContact.whatsappDisplay, action: text.whatsappAction, href: companyContact.whatsappUrl, external: true },
    { key: "phone", icon: Phone, title: text.phoneTitle, description: text.phoneText, display: companyContact.phoneDisplay, action: text.phoneAction, href: companyContact.phoneUrl, external: false },
    { key: "email", icon: Mail, title: text.emailTitle, description: text.emailText, display: companyContact.email, action: text.emailAction, href: companyContact.emailUrl, external: false },
  ];
  const error = (field: keyof FieldErrors) => errors[field] ? <span className="contact-page-field-error" id={`${field}-error`} role="alert">{errors[field]}</span> : null;
  const formFeedback = status === "loading" ? text.submitting : status === "success" ? text.successText : status === "error" ? text.errorText : Object.keys(errors).length ? text.errorTitle : "";

  return <main className="contact-page" ref={rootRef}>
    <section className="contact-page-hero">
      <div className="contact-page-hero-art" aria-hidden="true"><span /><span /><span /></div>
      <div className="container contact-page-hero-inner"><div className="contact-page-hero-copy">
        <span className="eyebrow contact-page-hero-eyebrow">{text.eyebrow}</span>
        <h1>{text.heroTitleStart}<br aria-hidden="true" /><span> {text.heroTitleAccent}</span></h1>
        <p>{text.heroText}</p>
        <div className="contact-page-hero-actions"><a className="button button-primary" href="#anfrage">{text.heroPrimary}<ArrowDown aria-hidden="true" /></a><a className="contact-page-text-link" href="#direktkontakt">{text.heroSecondary}<ArrowDown aria-hidden="true" /></a></div>
      </div></div>
    </section>

    <section className="contact-page-direct" id="direktkontakt"><div className="container">
      <header className="contact-page-section-heading" data-contact-reveal><span className="eyebrow">{text.directEyebrow}</span><h2>{text.directTitle}</h2><p>{text.directText}</p></header>
      <div className="contact-page-card-grid">{directContacts.map(({ key, icon: Icon, title, description, display, action, href, external }, index) => <a className={`contact-page-card ${key === "whatsapp" ? "is-whatsapp" : ""}`} data-contact-reveal href={href} key={key} style={{ "--contact-delay": `${index * 100}ms` } as React.CSSProperties} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><span className="contact-page-card-icon"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p><strong>{display}</strong><span className="contact-page-card-action">{action}<ArrowRight aria-hidden="true" /></span></a>)}</div>
    </div></section>

    <section className="contact-page-form-section" id="anfrage"><div className="container"><div className="contact-page-form-shell is-simple" data-contact-reveal>
      {status === "success" ? <div className="contact-page-result" role="status"><span className="contact-page-result-icon"><CheckCircle2 aria-hidden="true" /></span><h2>{text.successTitle}</h2><p>{text.successText}</p><div className="contact-page-result-actions"><button className="button button-primary" type="button" onClick={() => setStatus("idle")}><RotateCcw aria-hidden="true" />{text.newInquiry}</button><a className="button button-secondary" href={companyContact.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{text.whatsappAction}</a></div></div> : <>
        <header className="contact-page-form-heading"><span className="eyebrow">{text.formEyebrow}</span><h2>{text.formTitle}</h2><p>{text.formText}</p></header>
        {status === "error" ? <div className="contact-page-error-panel" role="alert"><div><strong>{text.errorTitle}</strong><p>{text.errorText}</p></div><div><a href={companyContact.whatsappUrl} target="_blank" rel="noopener noreferrer">{text.whatsappAction}</a><a href={companyContact.phoneUrl}>{text.phoneAction}</a></div></div> : null}
        <form className="contact-page-form is-simple" onSubmit={submit} noValidate aria-describedby="contact-form-feedback">
          <div className="sr-only" id="contact-form-feedback" aria-live="polite" aria-atomic="true">{formFeedback}</div>
          <div className="contact-page-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label></div>
          <label className={`contact-page-field ${errors.name ? "has-error" : ""}`}>{text.name} *<input ref={nameRef} name="name" maxLength={160} placeholder={text.namePlaceholder} required aria-required="true" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} value={form.name} onChange={(event) => update("name", event.target.value)} />{error("name")}</label>
          <label className={`contact-page-field ${errors.service ? "has-error" : ""}`}>{text.service} *<select ref={serviceRef} name="service" required aria-required="true" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined} value={form.service} onChange={(event) => update("service", event.target.value)}><option value="">{text.choose}</option>{services.map((service, index) => <option value={getServiceKey(index)} key={getServiceKey(index)}>{service[0]}</option>)}<option value="other">{text.other}</option></select>{error("service")}</label>
          <label className={`contact-page-field ${errors.contact ? "has-error" : ""}`}>{text.phone} <small>{text.optional}</small><input ref={phoneRef} type="tel" name="phone" maxLength={80} placeholder={text.phonePlaceholder} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? "contact-error" : undefined} value={form.phone} onChange={(event) => update("phone", event.target.value)} />{error("contact")}</label>
          <label className={`contact-page-field ${errors.email || errors.contact ? "has-error" : ""}`}>{text.email} <small>{text.optional}</small><input ref={emailRef} type="email" name="email" maxLength={254} placeholder={text.emailPlaceholder} aria-invalid={Boolean(errors.email || errors.contact)} aria-describedby={errors.email ? "email-error" : errors.contact ? "contact-error" : undefined} value={form.email} onChange={(event) => update("email", event.target.value)} />{error("email")}</label>
          <label className="contact-page-field full-field">{text.message} <small>{text.optional}</small><textarea name="message" rows={5} maxLength={3000} placeholder={text.messagePlaceholder} value={form.message} onChange={(event) => update("message", event.target.value)} /></label>
          <label className={`contact-page-privacy full-field ${errors.privacy_accepted ? "has-error" : ""}`}><input ref={privacyRef} type="checkbox" name="privacy_accepted" checked={form.privacy_accepted} required aria-required="true" aria-invalid={Boolean(errors.privacy_accepted)} aria-describedby={errors.privacy_accepted ? "privacy_accepted-error" : undefined} onChange={(event) => update("privacy_accepted", event.target.checked)} /><span>{text.privacy} <Link href="/datenschutz">{copy.footer.privacy}</Link><small>{text.privacyHelper}</small>{error("privacy_accepted")}</span></label>
          <button className="button button-primary contact-page-submit full-field" type="submit" disabled={status === "loading"}>{status === "loading" ? <span className="contact-page-spinner" aria-hidden="true" /> : <Send aria-hidden="true" />}{status === "loading" ? text.submitting : text.submit}</button>
        </form>
      </>}
    </div></div></section>
  </main>;
}
