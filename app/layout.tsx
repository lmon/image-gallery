import type { Metadata } from "next"
import "./globals.css"
import NavigationWrapper from "@/components/NavigationWrapper"
import GroupNavWrapper from "@/components/GroupNavWrapper"
import SessionProvider from "@/components/SessionProvider"

export const metadata: Metadata = {
  title: "Image Gallery",
  description: "A modern image gallery with admin management"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavigationWrapper />
          <GroupNavWrapper />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
