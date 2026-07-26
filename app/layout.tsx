import type { Metadata } from 'next'
import { JetBrains_Mono, Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

// Same three faces bubo-site uses, in the same roles.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body'
})

const bricolage = Bricolage_Grotesque({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://weekndlabs.com'),
  title: 'WeekndLabs | Agents run here.',
  description: 'Open-source developer tools from Indonesia. Omni cuts AI agent token spend by 58.9%, Heimsense points Claude Code at any LLM, Bubo names the app slowing down your Mac.',
  keywords: ['Agentic AI', 'Open Source', 'AI Infrastructure', 'Developer Tools', 'WeekndLabs', 'LLM Agents', 'Omni', 'Claude Code', 'token optimization', 'MCP'],
  authors: [{ name: 'WeekndLabs' }],
  creator: 'WeekndLabs',
  openGraph: {
    title: 'WeekndLabs | Agents run here.',
    description: 'WeekndLabs builds developer tools for the agentic era. Five shipped products covering agent context, LLM routing, pull request automation, macOS performance, and founder workflow. Open source, built in Indonesia.',
    url: 'https://weekndlabs.com',
    siteName: 'WeekndLabs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeekndLabs | Agents run here.',
    description: 'WeekndLabs builds developer tools for the agentic era. Five shipped products, open source, built in Indonesia.',
    creator: '@weekndlabs',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    title: 'WeekndLabs',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
}

export const viewport = {
  themeColor: '#12141F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} ${bricolage.variable}`}>
      <body className="font-sans bg-background text-text-primary min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
