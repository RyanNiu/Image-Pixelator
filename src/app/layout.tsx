import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Image Pixelator',
  description: 'Transform your images into pixel art masterpieces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}