import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SITE, siteGraph } from '@/lib/site'

/**
 * The exact files @weekndlabs/design ships, rather than the same families from
 * Google. Two reasons. The package's contrast and typography gates are written
 * against these faces, and a Google-served Inter is not guaranteed to be the
 * same cut. And next/font/local still self-hosts and preloads them, so nothing
 * is given up by reading them out of node_modules.
 *
 * Inter is one variable file spanning 100 to 900 with an optical size axis, so
 * headings and body text are drawn by the same file at different optical sizes.
 * That is why there is no separate display face here any more.
 */
const inter = localFont({
  src: '../node_modules/@weekndlabs/design/dist/fonts/inter-100-900.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = localFont({
  src: '../node_modules/@weekndlabs/design/dist/fonts/jetbrains-mono-400.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  // Relative, so each route canonicalises to itself rather than to the home page.
  alternates: { canonical: './' },
  keywords: ['Agentic AI', 'Open Source', 'AI Infrastructure', 'Developer Tools', 'WeekndLabs', 'LLM Agents', 'Selat', 'Omni', 'Claude Code', 'token optimization', 'MCP', 'OAuth gateway'],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    creator: '@weekndlabs',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    title: SITE.name,
    statusBarStyle: 'black-translucent',
    capable: true,
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#141416' },
  ],
}

/**
 * Runs before first paint, so a stored choice is applied with no flash of the
 * other theme.
 *
 * It always writes an attribute, which is the part that matters. The design
 * package defines its palettes under [data-theme] and falls back to dark under
 * :where(:root); deciding the theme here means the attribute is never missing,
 * the fallback is never reached, and the dark palette does not have to be
 * duplicated into a prefers-color-scheme block in CSS.
 *
 * The stored value stays 'light' or 'dark' under the key 'theme'. The docs site
 * at weekndlabs.com/design is same-origin and reads it, so renaming either
 * would break that page with no error here.
 */
const themeScript = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* What the site is, for engines that read structure rather than prose.
            Built from the same catalog the page renders, so it cannot drift. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph()) }} />
      </head>
      <body className="font-sans bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
