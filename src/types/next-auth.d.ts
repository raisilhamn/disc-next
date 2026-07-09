import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "HR" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role: "HR" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "HR" | "ADMIN"
  }
}

// next-auth's own "next-auth"/"next-auth/jwt" .d.ts files only do
// `export * from "@auth/core/..."` — they don't declare local interfaces,
// so augmenting those module specifiers doesn't merge into the types
// actually used internally (which resolve to @auth/core/*). Augment the
// underlying modules directly too.
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string
      role: "HR" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role: "HR" | "ADMIN"
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: "HR" | "ADMIN"
  }
}
