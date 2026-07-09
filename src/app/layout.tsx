import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://disc.raisilham.com"),
  title: "DISC Personality Test",
  description: "Tes DISC 24 Soal - Personality Assessment",
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
