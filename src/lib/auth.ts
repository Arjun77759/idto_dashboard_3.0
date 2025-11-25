export type AuthStorage = {
  access_token: string
  user_agent?: string
};

const AUTH_STORAGE_KEY = 'auth';

type SetAuthOptions = {
  persist?: boolean;
};

export function setAuth(auth: AuthStorage, options: SetAuthOptions = {}) {
  const shouldPersist = options.persist ?? true;
  try {
    const target = shouldPersist ? localStorage : sessionStorage;
    target.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));

    // Ensure the token only lives in one storage bucket.
    const fallback = shouldPersist ? sessionStorage : localStorage;
    fallback.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export function getAuth(): AuthStorage | null {
  const readAuth = (storage: Storage) => {
    try {
      const raw = storage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthStorage;
    } catch {
      return null;
    }
  };

  // Prefer session storage (non-persistent login) before falling back to persistent storage.
  return readAuth(sessionStorage) ?? readAuth(localStorage);
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export function getAccessToken(): string | null {
  const auth = getAuth();
  return auth?.access_token ?? null;
}


