type SessionUser = {
  id: number;
  email: string;
  full_name?: string;
  role: "admin" | "user";
  package_name: "starter" | "growth" | "agency";
  is_active: boolean;
};

export function saveToken(token: string) {
  localStorage.setItem("marketmind_token", token);
}

export function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("marketmind_token")
    : null;
}

export function clearToken() {
  localStorage.removeItem("marketmind_token");
  localStorage.removeItem("marketmind_user");
}

export function saveUser(user: SessionUser) {
  localStorage.setItem("marketmind_user", JSON.stringify(user));
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("marketmind_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}