const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(s: string): boolean {
  return UUID_RE.test(s)
}

const ipRequests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number
): { ok: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = ipRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { ok: false, retryAfter }
  }

  entry.count++
  return { ok: true }
}

export function sanitizeJsonBody(body: unknown, maxBytes: number): boolean {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return false
  }
  const raw = JSON.stringify(body)
  if (raw.length > maxBytes) return false
  return true
}

export function isValidQuestionNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 24
}

export function isValidOptionId(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0
}
