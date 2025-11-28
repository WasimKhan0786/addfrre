import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ad-Free Video Player',
  description: 'Play videos without ads - Developed by Wasim Khan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
