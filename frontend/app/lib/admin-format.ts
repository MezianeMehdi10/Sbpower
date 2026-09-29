import type { InquiryStatus } from "./admin-api";
import { adminCopy, type AdminLocale } from "./admin-copy";

export function formatAdminDate(value: string, detailed = false, locale: AdminLocale = "de") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", detailed
    ? { dateStyle: "medium", timeStyle: "short" }
    : { day: "2-digit", month: "2-digit", year: "numeric" }
  ).format(new Date(value));
}

export function serviceLabel(service: string, locale: AdminLocale) {
  return adminCopy[locale].services[service] ?? service;
}

export function statusLabel(status: InquiryStatus, locale: AdminLocale) {
  return adminCopy[locale].statuses[status];
}

export function whatsappForCustomer(phone: string) {
  if (!/^\s*\+/.test(phone)) return null;
  const normalized = phone.replace(/\D/g, "");
  return normalized.length >= 8 && normalized.length <= 15 ? `https://wa.me/${normalized}` : null;
}
