import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pohela Baisakh 1432 — Udjapon Community',
  description: 'Event attendee management for Pohela Baisakh celebration by Udjapon Community, April 25, 2025',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
