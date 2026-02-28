import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Urbanflux Smart-City Mobility Intelligence',
  description: 'Enterprise mobility intelligence and transit orchestration for modern smart cities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0E0F13] text-slate-50 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
