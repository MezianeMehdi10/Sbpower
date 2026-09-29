"use client";

import { useLanguage } from "./language-provider";

export function LegalContent({ type }: { type: "imprint" | "privacy" }) {
  const { copy } = useLanguage();
  const legal = copy.legal;

  if (type === "imprint") return <main><section className="page-hero compact"><div className="container narrow"><span className="eyebrow">SB Power</span><h1>{legal.imprintTitle}</h1></div></section><section className="section"><div className="container legal-content"><div className="legal-notice">{legal.notice}</div><h2>{legal.provider}</h2><p>SB Power Gebäudereinigung<br />Bremen und Umgebung</p><h2>{legal.address}</h2><p>{legal.pending}</p><h2>{legal.representative}</h2><p>{legal.pending}</p><h2>{legal.tax}</h2><p>{legal.pending}</p><h2>{legal.contact}</h2><p>{copy.footer.phone}<br />{copy.footer.email}</p></div></section></main>;

  return <main><section className="page-hero compact"><div className="container narrow"><span className="eyebrow">SB Power</span><h1>{legal.privacyTitle}</h1><p>{legal.privacyIntro}</p></div></section><section className="section"><div className="container legal-content"><div className="legal-notice">{legal.notice}</div><h2>{legal.controller}</h2><p>SB Power Gebäudereinigung<br />Bremen und Umgebung<br />{legal.pending}</p><h2>{legal.formData}</h2><p>{legal.formText}</p><h2>{legal.retention}</h2><p>{legal.retentionText}</p><h2>{legal.rightsTitle}</h2><p>{legal.rightsText}</p><h2 id="cookie-settings">{legal.cookiesTitle}</h2><p>{legal.cookiesText}</p></div></section></main>;
}
