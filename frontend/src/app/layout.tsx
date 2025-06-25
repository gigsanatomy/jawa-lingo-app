import "./globals.css";
import type { ReactNode } from "react";
import AppShell from '../components/app-shell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-blue-50 min-h-screen font-sans">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
