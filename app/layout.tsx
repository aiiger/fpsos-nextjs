import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FPSOS - Frame Per Second Operating System | CS2 Optimization Dubai',
  description: 'Professional CS2 optimization services in Dubai. BIOS tuning, system optimization, and performance analysis for competitive gaming.',
  keywords: 'CS2 optimization, gaming PC tuning, BIOS optimization Dubai, FPS boost, competitive gaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)'
            }
          }}
        />
      </body>
    </html>
  )
}
