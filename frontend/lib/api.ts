import { getToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;

    try {
      const data = await res.json();
      errorMessage =
        data?.detail ||
        data?.message ||
        data?.error ||
        JSON.stringify(data);
    } catch {
      const text = await res.text();
      errorMessage = text || errorMessage;
    }

    console.error("API error:", res.status, errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function postJson<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return handleResponse<T>(res);
  } catch (error) {
    console.error("Network/fetch error:", error);
    throw new Error(
      "Could not connect to backend. Check if FastAPI is running and CORS is configured."
    );
  }
}

export async function putJson<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return handleResponse<T>(res);
  } catch (error) {
    console.error("Network/fetch error:", error);
    throw new Error(
      "Could not connect to backend. Check if FastAPI is running and CORS is configured."
    );
  }
}

export async function getJson<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = {
    ...getAuthHeaders(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    return handleResponse<T>(res);
  } catch (error) {
    console.error("Network/fetch error:", error);
    throw new Error(
      "Could not connect to backend. Check if FastAPI is running and CORS is configured."
    );
  }
}