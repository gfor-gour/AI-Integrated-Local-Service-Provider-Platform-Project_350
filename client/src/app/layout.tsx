import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
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
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937", // Tailwind gray-800
              color: "#ffffff",
              border: "1px solid #4b5563", // Tailwind gray-600
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10b981", // green-500
                secondary: "#1f2937", // matches background
              },
            },
          }}
        />
      </body>
    </html>
  )
}
