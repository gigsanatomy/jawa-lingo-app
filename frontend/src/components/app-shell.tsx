import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './Navbar';
import { usePathname, useRouter } from 'next/navigation';

interface AppShellProps {
  children: ReactNode;
  hero?: ReactNode;
  fab?: ReactNode;
}

const TABS = [
  { label: 'Pembelajaran', href: '/pembelajaran', icon: 'fa-graduation-cap' },
  { label: 'Kamus', href: '/kamus', icon: 'fa-book' },
  { label: 'Builder', href: '/builder', icon: 'fa-wand-magic-sparkles' },
  { label: 'Roleplay', href: '/roleplay', icon: 'fa-comments' },
  { label: 'Quiz', href: '/quiz', icon: 'fa-lightbulb' },
];

const AppShell = ({ children, hero, fab }: AppShellProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-900 font-sans text-neutral-900 dark:text-neutral-100 antialiased overflow-x-hidden">
      <div className="sticky top-0 z-40 shadow-md shadow-blue-100/40 dark:shadow-blue-900/30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <Navbar />
        {/* Sticky Tab Navigation */}
        <nav className="flex justify-center items-center gap-1 md:gap-2 px-2 py-2 bg-white/90 dark:bg-neutral-950/90 rounded-b-xl shadow-sm sticky top-0 z-30">
          {TABS.map(tab => {
            const active = pathname.startsWith(tab.href);
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200
                  ${active ? 'bg-green-600 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-green-100'}
                `}
                aria-current={active ? 'page' : undefined}
              >
                <i className={`fa-solid ${tab.icon} text-lg md:text-xl ${active ? 'text-yellow-300' : 'text-green-600'}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {hero && <div className="w-full max-w-4xl mx-auto px-4 mt-8 mb-4">{hero}</div>}
      <main className="flex-1 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10 items-center justify-center">
        {children}
      </main>
      {fab && (
        <div className="fixed bottom-6 right-6 z-50">{fab}</div>
      )}
      <Toaster position="top-right" toastOptions={{
        className: 'text-sm font-medium',
        style: { background: '#222', color: '#fff' },
      }} />
    </div>
  );
};

export default AppShell; 