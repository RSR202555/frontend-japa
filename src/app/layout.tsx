import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { CustomCursor } from '@/components/ui/CustomCursor'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight:   '400',
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Japa Treinador',
    template: '%s | Japa Treinador',
  },
  description: 'Plataforma de Consultoria Online Fitness personalizada.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable:        true,
    statusBarStyle: 'black-translucent',
    title:          'Japa Treinador',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor:   '#0A0A0A',
  width:        'device-width',
  initialScale:  1,
  maximumScale:  1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body suppressHydrationWarning>
        <GrainOverlay />
        <CustomCursor />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
