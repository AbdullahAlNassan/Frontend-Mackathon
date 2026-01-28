const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem("token") ?? "";
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
