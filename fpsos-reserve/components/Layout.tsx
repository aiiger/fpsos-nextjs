
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  showOwnerToggle?: () => void;
  isOwnerView?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, showOwnerToggle, isOwnerView }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
      {/* Floating Navigation Menu inspired by your site */}
      <nav className="fixed top-6 z-50 w-full max-w-2xl bg-black/80 apple-blur border border-white/10 px-6 py-3 rounded-full flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M9 15C9 16.6569 7.65685 18 6 18C4.34315 18 3 16.6569 3 15C3 13.3431 4.34315 12 6 12C7.65685 12 9 13.3431 9 15ZM9 15V9M9 9C9 7.34315 7.65685 6 6 6C4.34315 6 3 7.34315 3 9C3 10.6569 4.34315 12 6 12C7.65685 12 9 10.6569 9 9ZM9 9H15M15 9C15 7.34315 16.3431 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12C16.3431 12 15 10.6569 15 9ZM15 9V15M15 15C15 16.6569 16.3431 18 18 18C19.6569 18 21 16.6569 21 15C21 13.3431 19.6569 12 18 12C16.3431 12 15 13.3431 15 15ZM15 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold tracking-tighter text-lg">FPSOS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
             <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-zinc-600">⚡</span> Reaction</span>
             <span className="text-white flex items-center gap-1.5"><span className="text-cyan-400">📦</span> Book Session</span>
             <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-zinc-600">⚙️</span> Hardware</span>
          </div>
        </div>
        
        <button 
          onClick={showOwnerToggle}
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-full border border-white/5"
        >
          {isOwnerView ? 'Customer' : 'Owner'}
        </button>
      </nav>

      <div className="mt-28 w-full max-w-4xl">
        <header className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Engineering, not magic.</h2>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">Verifiable, kernel-level scheduling for your professional sessions. Performance-tuned booking for elite teams.</p>
        </header>

        <main className="w-full glass-card rounded-[32px] overflow-hidden flex flex-col md:flex-row min-h-[620px] relative z-10">
          {children}
        </main>
      </div>
      
      <footer className="mt-16 pb-12 text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em] text-center">
        &copy; {new Date().getFullYear()} FPSOS RESERVE &bull; KERNEL-LEVEL PRECISION
      </footer>
    </div>
  );
};

export default Layout;
