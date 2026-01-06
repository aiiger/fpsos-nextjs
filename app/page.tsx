'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="pixelPage">
      <Link href="/packages" className="pixelCanvas" aria-label="View FPSOS packages">
        <Image
          src="/canva/landing.png"
          alt="FPSOS Canva landing page mockup"
          width={1920}
          height={1080}
          priority
          className="pixelImage"
        />
      </Link>
    </main>
  )
}
