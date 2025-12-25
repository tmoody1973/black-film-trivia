import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { GoogleAnalytics } from '@/components/google-analytics'
import { UserSync } from '@/components/user-sync'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Black Cultural Trivia',
  description: 'Test your knowledge of Black films and literature',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <ConvexClientProvider>
            <UserSync />
            <GoogleAnalytics />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
