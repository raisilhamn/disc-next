const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(s: string): boolean {
  return UUID_RE.test(s)
}

let ratelimit: {
  create: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
  submit: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
  lookup: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
} | null = null

async function getRatelimit() {
  if (ratelimit) return ratelimit
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("[security] Vercel KV not configured — rate limiting disabled")
    return null
  }

  const { Ratelimit } = await import("@upstash/ratelimit")
  const { Redis } = await import("@upstash/redis")

  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  })

  const create = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    prefix: "rl:create",
  })

  const submit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "rl:submit",
  })

  const lookup = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "rl:lookup",
  })

  ratelimit = {
    create: async (ip: string) => create.limit(ip).then((r) => ({ ok: r.success, retryAfter: r.reset })),
    submit: async (ip: string) => submit.limit(ip).then((r) => ({ ok: r.success, retryAfter: r.reset })),
    lookup: async (ip: string) => lookup.limit(ip).then((r) => ({ ok: r.success, retryAfter: r.reset })),
  }

  return ratelimit
}

export async function checkCreateLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return rl.create(ip)
}

export async function checkSubmitLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return rl.submit(ip)
}

export async function checkLookupLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return rl.lookup(ip)
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
