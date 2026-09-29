"use client";

import Link from "next/link";
import { ArrowLeft, Check, Mail, MessageCircle, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLoading, AdminShell } from "@/app/components/admin-shell";
import { useAdminGuard } from "@/app/components/admin-auth";
import { AdminInquiry, getAdminInquiry, InquiryStatus, updateInquiryStatus } from "@/app/lib/admin-api";
import { formatAdminDate, serviceLabel, statusLabel, whatsappForCustomer } from "@/app/lib/admin-format";
import { useAdminLanguage } from "@/app/components/admin-language-provider";

export default function AdminRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const inquiryId = Number(params.id);
  const { user, loading: authLoading } = useAdminGuard();
  const { copy, locale } = useAdminLanguage();
  const [inquiry, setInquiry] = useState<AdminInquiry | null>(null);
  const [error, setError] = useState<"" | "load" | "save">("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !Number.isInteger(inquiryId)) return;
    getAdminInquiry(inquiryId).then(setInquiry).catch(() => setError("load"));
  }, [inquiryId, user]);

  async function changeStatus(status: InquiryStatus) {
    if (!inquiry || saving || status === inquiry.status) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateInquiryStatus(inquiry.id, status);
      setInquiry(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch { setError("save"); }
    finally { setSaving(false); }
  }

  if (authLoading || !user) return <AdminLoading />;
  if (error === "load" && !inquiry) return <AdminShell user={user}><main className="admin-main"><div className="admin-notice is-error" role="alert">{copy.detail.loadError}</div><Link className="admin-back-link" href="/admin/requests"><ArrowLeft aria-hidden="true" />{copy.detail.back}</Link></main></AdminShell>;
  if (!inquiry) return <AdminLoading />;
  const whatsappUrl = whatsappForCustomer(inquiry.phone);

  return <AdminShell user={user}><main className="admin-main admin-detail-main">
    <Link className="admin-back-link" href="/admin/requests"><ArrowLeft aria-hidden="true" />{copy.detail.back}</Link>
    <div className="admin-detail-heading"><div><span className="admin-kicker">{copy.detail.request} #{inquiry.id}</span><h1>{inquiry.name}</h1><p>{copy.detail.received} {formatAdminDate(inquiry.created_at, true, locale)}</p></div><span className={`admin-status is-${inquiry.status}`}>{statusLabel(inquiry.status, locale)}</span></div>
    {error === "save" ? <div className="admin-notice is-error" role="alert">{copy.detail.saveError}</div> : null}
    <div className="admin-detail-grid">
      <section className="admin-detail-card"><h2>{copy.detail.customer}</h2><dl className="admin-detail-list"><div><dt>{copy.detail.name}</dt><dd>{inquiry.name}</dd></div><div><dt>{copy.detail.phone}</dt><dd>{inquiry.phone || copy.detail.notProvided}</dd></div><div><dt>{copy.detail.email}</dt><dd>{inquiry.email || copy.detail.notProvided}</dd></div><div><dt>{copy.detail.service}</dt><dd>{serviceLabel(inquiry.service, locale)}</dd></div><div className="is-wide"><dt>{copy.detail.message}</dt><dd className="admin-message">{inquiry.message || copy.detail.noMessage}</dd></div></dl></section>
      <aside className="admin-actions-card"><h2>{copy.detail.contactCustomer}</h2><div className="admin-contact-actions">{inquiry.phone ? <a className="button button-primary" href={`tel:${inquiry.phone}`}><Phone aria-hidden="true" />{copy.detail.call}</a> : null}{inquiry.email ? <a className="button button-secondary" href={`mailto:${inquiry.email}`}><Mail aria-hidden="true" />{copy.detail.writeEmail}</a> : null}{whatsappUrl ? <a className="button button-secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a> : null}</div><hr /><label>{copy.detail.status}<select value={inquiry.status} disabled={saving} onChange={(event) => changeStatus(event.target.value as InquiryStatus)}><option value="new">{copy.statuses.new}</option><option value="contacted">{copy.statuses.contacted}</option><option value="closed">{copy.statuses.closed}</option></select></label>{saved ? <p className="admin-save-feedback" role="status"><Check aria-hidden="true" />{copy.detail.saved}</p> : null}</aside>
    </div>
  </main></AdminShell>;
}
