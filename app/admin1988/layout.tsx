'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30 ${inter.className}`}>
            {children}
        </div>
    );
}
