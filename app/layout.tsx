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
    <ClerkProvider
      appearance={{
        elements: {
          modalContent:
            "bg-[#0b1220] text-white border border-white/10 shadow-2xl rounded-3xl",
          modalCloseButton:
            "text-white hover:text-blue-300 bg-white/10 border border-white/10 rounded-xl",
          card: "bg-[#0b1220] shadow-none border-0",
          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-white/60",
          socialButtonsBlockButton:
            "bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl",
          socialButtonsBlockButtonText: "text-white font-medium",
          dividerLine: "bg-white/10",
          dividerText: "text-white/50",
          formFieldLabel: "text-white/80",
          formFieldInput:
            "bg-white/5 border border-white/10 text-white placeholder:text-white/35 rounded-xl",
          formButtonPrimary:
            "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl shadow-lg",
          footerActionText: "text-white/60",
          footerActionLink: "text-blue-300 hover:text-blue-200",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-blue-300",
        },
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}