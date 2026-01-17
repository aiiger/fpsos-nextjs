import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono, Rajdhani } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FPSOS - Frame Per Second Operating System | CS2 Optimization Dubai',
  description: 'Professional CS2 optimization services in Dubai. BIOS tuning, system optimization, and performance analysis for competitive gaming.',
  keywords: 'CS2 optimization, gaming PC tuning, BIOS optimization Dubai, FPS boost, competitive gaming.',
  authors: [{ name: 'FPSOS Team' }],
  openGraph: {
    title: 'FPSOS - Professional CS2 Optimization',
    description: 'Elevate your competitive edge with Dubai\'s premier gaming PC tuning service.',
    url: 'https://fpsos.gg',
    siteName: 'FPSOS',
    images: [
      {
        url: 'https://fpsos.gg/preview.webp',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPSOS - CS2 Optimization',
    description: 'Dubai\'s elite gaming PC optimization service.',
    images: ['https://fpsos.gg/preview.webp'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#050505]">
      <body className={`${GeistSans.variable} ${jetbrains.variable} ${rajdhani.variable} bg-[#050505] text-white antialiased`}>

        {/* Layer 0: Obsidian Blueprint Grid (LOCKED) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Base Color */}
          <div className="absolute inset-0 bg-[#050505]" />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Radial Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505]" />
        </div>

        {/* Layer 10+: Content */}
        <div className="relative z-10">
          <SiteHeader />
          {children}
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#ffffff',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px'
            }
          }}
        />
      </body>
    </html>
  );
}
