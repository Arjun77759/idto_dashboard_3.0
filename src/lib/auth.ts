export type AuthStorage = {
  access_token: string
  user_agent?: string
};

const AUTH_STORAGE_KEY = 'auth';

export function setAuth(auth: AuthStorage) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {}
}

export function getAuth(): AuthStorage | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthStorage;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export function getAccessToken(): string | null {
  const auth = getAuth();
  return auth?.access_token ?? null;
}


