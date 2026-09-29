"use client";

import Image from "next/image";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession, loginAdmin } from "@/app/lib/admin-api";
import { AdminLanguageSwitcher, useAdminLanguage } from "@/app/components/admin-language-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { copy } = useAdminLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getAdminSession().then((session) => {
      if (session.authenticated) router.replace("/admin/requests");
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setHasError(false);
    setLoading(true);
    try {
      await loginAdmin(email, password);
      router.replace("/admin/requests");
      router.refresh();
    } catch {
      setHasError(true);
      setLoading(false);
    }
  }

  if (checking) return <main className="admin-loading" aria-busy="true"><span className="admin-loader" /><p>{copy.login.checking}</p></main>;

  return <main className="admin-login-page">
    <div className="admin-login-waves" aria-hidden="true"><span /><span /></div>
    <section className="admin-login-card">
      <AdminLanguageSwitcher className="admin-login-language" />
      <Image src="/images/logo2.png" alt="SB Power" width={150} height={98} priority />
      <span className="admin-kicker">{copy.administration}</span>
      <h1>{copy.login.title}</h1>
      <p>{copy.login.intro}</p>
      {hasError ? <div className="admin-login-error" role="alert">{copy.login.error}</div> : null}
      <form onSubmit={submit} noValidate>
        <label>{copy.login.email}<div className="admin-input"><Mail aria-hidden="true" /><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label>
        <label>{copy.login.password}<div className="admin-input"><LockKeyhole aria-hidden="true" /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" aria-label={showPassword ? copy.login.hidePassword : copy.login.showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div></label>
        <button className="button button-primary admin-login-submit" type="submit" disabled={loading}><LogIn aria-hidden="true" />{loading ? copy.login.submitting : copy.login.submit}</button>
      </form>
    </section>
  </main>;
}
