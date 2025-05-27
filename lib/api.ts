import { getAuthToken } from "./auth"

const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost:8080"

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export interface ErrorResponse {
  code: number
  error: string
  message: string
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = await getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${PAYMENT_API_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
