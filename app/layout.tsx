import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
 
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
 
export const metadata: Metadata = {
  title: "SoulTrack AI",
  description: "AI mood tracking app",
}
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="relative min-h-screen bg-gradient-to-b from-blue-950 via-slate-950 to-black">
            {children}
            <div className="pointer-events-none absolute inset-0 border-4 border-blue-300/60 shadow-[0_0_26px_rgba(59,130,246,0.35)]" />
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}