import type { Metadata } from 'next'
import { JetBrains_Mono, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
})

const ibmPlexMono = IBM_Plex_Mono({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-geist'
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
    description: 'Open-source developer tools from Indonesia. Omni cuts AI agent token spend by 58.9%, Heimsense points Claude Code at any LLM, Bubo names the app slowing down your Mac.',
    url: 'https://weekndlabs.com',
    siteName: 'WeekndLabs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeekndLabs | Agents run here.',
    description: 'Open-source developer tools from Indonesia. Omni cuts AI agent token spend by 58.9% on a real command mix.',
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
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${ibmPlexMono.variable}`}>
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
