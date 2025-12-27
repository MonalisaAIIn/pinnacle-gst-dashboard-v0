export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: string
  plan: string
}

export function generateMockUser(phone: string, email?: string): User {
  return {
    id: "user-" + Math.random().toString(36).substr(2, 9),
    email: email || `${phone}@example.com`,
    phone,
    name: "Demo User",
    role: "user",
    plan: "professional",
  }
}

export function generateMockToken(): string {
  return "mock-jwt-token-" + Math.random().toString(36).substr(2, 16)
}
