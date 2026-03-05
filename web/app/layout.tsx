import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CardioPredict | Clinical ML',
  description: 'Advanced Predictive Analysis for Heart Disease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#0d1117] text-slate-200`}
        suppressHydrationWarning
      >
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 w-full bg-[#0d1117]/80 backdrop-blur-md border-b border-indigo-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 font-semibold text-lg text-white hover:opacity-80 transition-opacity tracking-tight"
              >
                <span className="p-1.5 bg-indigo-600 rounded-md shadow-lg shadow-indigo-600/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
                  </svg>
                </span>
                Cardio<span className="text-indigo-400">Predict</span>
              </Link>

              {/* Nav */}
              <nav className="hidden sm:flex sm:items-center sm:space-x-1">
                <Link href="/" className="px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:text-white hover:bg-white/5 transition-colors">
                  Overview
                </Link>
                <Link href="/predict" className="px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:text-white hover:bg-white/5 transition-colors">
                  Assessment
                </Link>
                <Link href="/guide" className="px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:text-white hover:bg-white/5 transition-colors">
                  Guide
                </Link>
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:text-white hover:bg-white/5 transition-colors">
                  Analytics
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-fade-in-up">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-indigo-900/30 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CardioPredict.
            </p>
            <p className="text-xs text-slate-600">
              For academic and educational purposes only. Not a substitute for clinical diagnosis.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
