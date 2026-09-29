"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Inbox, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLoading, AdminShell } from "@/app/components/admin-shell";
import { useAdminGuard } from "@/app/components/admin-auth";
import { AdminInquiry, getAdminInquiries, InquiryListResponse } from "@/app/lib/admin-api";
import { formatAdminDate, serviceLabel, statusLabel } from "@/app/lib/admin-format";
import { useAdminLanguage } from "@/app/components/admin-language-provider";

const emptyData: InquiryListResponse = {
  results: [],
  counts: { new: 0, contacted: 0, closed: 0 },
  pagination: { page: 1, page_size: 20, total: 0, total_pages: 1, has_next: false, has_previous: false },
};

export default function AdminRequestsPage() {
  const { user, loading: authLoading } = useAdminGuard();
  const { copy, locale } = useAdminLanguage();
  const [data, setData] = useState(emptyData);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      setLoading(true);
      getAdminInquiries(query, status, page).then((result) => {
        setData(result);
        setHasError(false);
      }).catch(() => setHasError(true)).finally(() => setLoading(false));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [page, query, status, user]);

  if (authLoading || !user) return <AdminLoading />;

  return <AdminShell user={user}><main className="admin-main">
    <header className="admin-page-heading"><div><span className="admin-kicker">{copy.list.kicker}</span><h1>{copy.list.title}</h1><p>{copy.list.intro}</p></div></header>
    <section className="admin-summary" aria-label={copy.list.summary}>
      <article><span className="admin-summary-icon is-new"><Inbox aria-hidden="true" /></span><div><strong>{data.counts.new}</strong><span>{copy.list.newRequests}</span></div></article>
      <article><span className="admin-summary-icon is-contacted"><Clock3 aria-hidden="true" /></span><div><strong>{data.counts.contacted}</strong><span>{copy.list.contacted}</span></div></article>
      <article><span className="admin-summary-icon is-closed"><CheckCircle2 aria-hidden="true" /></span><div><strong>{data.counts.closed}</strong><span>{copy.list.closed}</span></div></article>
    </section>
    <section className="admin-list-panel">
      <div className="admin-list-toolbar"><label><span className="sr-only">{copy.list.searchLabel}</span><Search aria-hidden="true" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={copy.list.searchPlaceholder} /></label><select aria-label={copy.list.filterLabel} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">{copy.list.allStatuses}</option><option value="new">{copy.statuses.new}</option><option value="contacted">{copy.statuses.contacted}</option><option value="closed">{copy.statuses.closed}</option></select></div>
      {hasError ? <div className="admin-notice is-error" role="alert">{copy.list.loadError}</div> : null}
      {loading ? <div className="admin-list-loading"><span className="admin-loader" />{copy.list.loading}</div> : data.results.length ? <><div className="admin-table-wrap"><table><thead><tr><th>{copy.list.columns.status}</th><th>{copy.list.columns.name}</th><th>{copy.list.columns.service}</th><th>{copy.list.columns.phone}</th><th>{copy.list.columns.email}</th><th>{copy.list.columns.date}</th><th><span className="sr-only">{copy.list.columns.action}</span></th></tr></thead><tbody>{data.results.map((inquiry, index) => <RequestRow inquiry={inquiry} index={index} key={inquiry.id} />)}</tbody></table></div><div className="admin-mobile-list">{data.results.map((inquiry, index) => <RequestCard inquiry={inquiry} index={index} key={inquiry.id} />)}</div><div className="admin-pagination" aria-label={copy.list.pageInfo(data.pagination.page, data.pagination.total_pages)}><button type="button" disabled={!data.pagination.has_previous || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}>{copy.list.previousPage}</button><span>{copy.list.pageInfo(data.pagination.page, data.pagination.total_pages)}</span><button type="button" disabled={!data.pagination.has_next || loading} onClick={() => setPage((value) => value + 1)}>{copy.list.nextPage}</button></div></> : <div className="admin-empty"><Inbox aria-hidden="true" /><h2>{query || status ? copy.list.noResultsTitle : copy.list.emptyTitle}</h2><p>{query || status ? copy.list.noResultsText : copy.list.emptyText}</p></div>}
    </section>
  </main></AdminShell>;
}

function StatusBadge({ value }: { value: AdminInquiry["status"] }) { const { locale } = useAdminLanguage(); return <span className={`admin-status is-${value}`}>{statusLabel(value, locale)}</span>; }
function RequestRow({ inquiry, index }: { inquiry: AdminInquiry; index: number }) { const { copy, locale } = useAdminLanguage(); return <tr style={{ "--row-delay": `${Math.min(index, 8) * 45}ms` } as React.CSSProperties}><td><StatusBadge value={inquiry.status} /></td><td><strong>{inquiry.name}</strong></td><td>{serviceLabel(inquiry.service, locale)}</td><td>{inquiry.phone || "–"}</td><td>{inquiry.email || "–"}</td><td>{formatAdminDate(inquiry.created_at, false, locale)}</td><td><Link className="admin-row-action" href={`/admin/requests/${inquiry.id}`} aria-label={copy.list.openFor(inquiry.name)}><ArrowRight aria-hidden="true" /></Link></td></tr>; }
function RequestCard({ inquiry, index }: { inquiry: AdminInquiry; index: number }) { const { copy, locale } = useAdminLanguage(); return <article className="admin-request-card" style={{ "--row-delay": `${Math.min(index, 8) * 45}ms` } as React.CSSProperties}><div><StatusBadge value={inquiry.status} /><span>{formatAdminDate(inquiry.created_at, false, locale)}</span></div><h2>{inquiry.name}</h2><p>{serviceLabel(inquiry.service, locale)}</p><dl><div><dt>{copy.list.columns.phone}</dt><dd>{inquiry.phone || "–"}</dd></div><div><dt>{copy.list.columns.email}</dt><dd>{inquiry.email || "–"}</dd></div></dl><Link href={`/admin/requests/${inquiry.id}`}>{copy.list.open}<ArrowRight aria-hidden="true" /></Link></article>; }
