export type AdminUser = { email: string; name: string };
export type AdminSession = { authenticated: boolean; user: AdminUser | null; csrfToken: string };
export type InquiryStatus = "new" | "contacted" | "closed";
export type AdminInquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  status: InquiryStatus;
  language: string;
  created_at: string;
  updated_at: string;
};
export type InquiryListResponse = {
  results: AdminInquiry[];
  counts: Record<InquiryStatus, number>;
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
let csrfToken = "";

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.detail || "Die Anfrage konnte nicht verarbeitet werden.");
    Object.assign(error, { status: response.status });
    throw error;
  }
  return data;
}

export async function getAdminSession(): Promise<AdminSession> {
  const response = await fetch(`${apiUrl}/admin/session/`, { credentials: "include", cache: "no-store" });
  const data = await readJson(response) as AdminSession;
  csrfToken = data.csrfToken;
  return data;
}

async function adminMutation<T>(path: string, method: "POST" | "PATCH", body?: unknown): Promise<T> {
  if (!csrfToken) await getAdminSession();
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken },
    body: JSON.stringify(body ?? {}),
  });
  const data = await readJson(response) as T & { csrfToken?: string };
  if (data.csrfToken) csrfToken = data.csrfToken;
  return data;
}

export function loginAdmin(email: string, password: string) {
  return adminMutation<{ success: true; user: AdminUser; csrfToken: string }>("/admin/login/", "POST", { email, password });
}

export function logoutAdmin() {
  return adminMutation<{ success: true }>("/admin/logout/", "POST").finally(() => {
    csrfToken = "";
  });
}

export async function getAdminInquiries(query = "", status = "", page = 1): Promise<InquiryListResponse> {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const suffix = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`${apiUrl}/admin/contact-requests/${suffix}`, { credentials: "include", cache: "no-store" });
  return readJson(response) as Promise<InquiryListResponse>;
}

export async function getAdminInquiry(id: number): Promise<AdminInquiry> {
  const response = await fetch(`${apiUrl}/admin/contact-requests/${id}/`, { credentials: "include", cache: "no-store" });
  return readJson(response) as Promise<AdminInquiry>;
}

export function updateInquiryStatus(id: number, status: InquiryStatus): Promise<AdminInquiry> {
  return adminMutation<AdminInquiry>(`/admin/contact-requests/${id}/`, "PATCH", { status });
}
