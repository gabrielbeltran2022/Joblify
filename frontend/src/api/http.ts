export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, ""); // for image paths like /uploads/...

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let refreshing: Promise<void> | null = null;

const doRefresh = async () => {
  const res = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(401, "Session expired");
};

export const refreshAccessToken = (): Promise<void> => {
  refreshing ??= doRefresh().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

export const apiFetch = async (path: string, init: RequestInit = {credentials: "include"}): Promise<Response> => {
  const opts: RequestInit = { ...init, credentials: "include" };
  let res = await fetch(`${API_URL}${path}`, opts);

  if (res.status === 401) {
    await refreshAccessToken(); 
    res = await fetch(`${API_URL}${path}`, opts);
  }
  return res;
};

export const readError = async (res: Response, fallback: string) => {
  const body = await res.json().catch(() => ({}));
  return new ApiError(res.status, body.message || fallback);
};