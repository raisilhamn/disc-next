import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
