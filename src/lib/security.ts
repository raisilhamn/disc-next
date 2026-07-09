const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(s: string): boolean {
  return UUID_RE.test(s)
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip") || "unknown"
}

let ratelimit: {
  create: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
  submit: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
  lookup: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
  login: (ip: string) => Promise<{ ok: boolean; retryAfter?: number }>
} | null = null

async function getRatelimit() {
  if (ratelimit) return ratelimit

  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    console.warn("[security] Redis (Upstash/KV) not configured — rate limiting disabled")
    return null
  }

  const { Ratelimit } = await import("@upstash/ratelimit")
  const { Redis } = await import("@upstash/redis")

  const redis = new Redis({ url: redisUrl, token: redisToken })

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

  const login = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "rl:login",
  })

  const toRetryAfterSeconds = (resetMs: number) =>
    Math.max(1, Math.ceil((resetMs - Date.now()) / 1000))

  ratelimit = {
    create: async (ip: string) =>
      create.limit(ip).then((r) => ({ ok: r.success, retryAfter: toRetryAfterSeconds(r.reset) })),
    submit: async (ip: string) =>
      submit.limit(ip).then((r) => ({ ok: r.success, retryAfter: toRetryAfterSeconds(r.reset) })),
    lookup: async (ip: string) =>
      lookup.limit(ip).then((r) => ({ ok: r.success, retryAfter: toRetryAfterSeconds(r.reset) })),
    login: async (ip: string) =>
      login.limit(ip).then((r) => ({ ok: r.success, retryAfter: toRetryAfterSeconds(r.reset) })),
  }

  return ratelimit
}

async function safeCheck(fn: () => Promise<{ ok: boolean; retryAfter?: number }>) {
  try {
    return await fn()
  } catch {
    return { ok: true }
  }
}

export async function checkCreateLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return safeCheck(() => rl.create(ip))
}

export async function checkSubmitLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return safeCheck(() => rl.submit(ip))
}

export async function checkLookupLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return safeCheck(() => rl.lookup(ip))
}

export async function checkLoginLimit(ip: string) {
  const rl = await getRatelimit()
  if (!rl) return { ok: true }
  return safeCheck(() => rl.login(ip))
}

export function isNonEmptyString(s: unknown, maxLen: number): s is string {
  return typeof s === "string" && s.trim().length > 0 && s.trim().length <= maxLen
}

export function sanitizeJsonBody(body: unknown, maxBytes: number): boolean {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return false
  }
  const raw = JSON.stringify(body)
  if (Buffer.byteLength(raw, "utf8") > maxBytes) return false
  return true
}

export function isValidQuestionNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 24
}

export function isValidOptionId(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n > 0
}
