export async function getAuthToken(): Promise<string> {
  // In a real app, this would get the token from localStorage, cookies, or auth context
  // For now, returning a mock token - replace with your actual auth implementation
  const token = localStorage.getItem("token") || "mock-jwt-token"
  return token
}

export function setAuthToken(token: string): void {
  localStorage.setItem("token", token)
}

export function removeAuthToken(): void {
  localStorage.removeItem("token")
}
