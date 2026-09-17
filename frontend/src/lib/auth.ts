export type UserRole = "candidate" | "recruiter";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    return null;
  }
}

export function getUserRole(): UserRole | null {
  const user = getStoredUser();

  return user?.role ?? null;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem("access_token"));
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}