import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ConsentManager } from "@/components/privacy/consent-manager"
import "./globals.css"

export const metadata: Metadata = {
  title: "Digital Footprint Risk Analyzer - Check Your Online Exposure",
  description:
    "Discover what personal information is exposed online. Get your Digital Risk Score and AI-powered recommendations to protect your digital footprint.",
  generator: "Digital Footprint Risk Analyzer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <ConsentManager />
        <Analytics />
      </body>
    </html>
  )
}
