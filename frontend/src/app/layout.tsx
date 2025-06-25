import "../globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-blue-50 min-h-screen font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto p-4 mt-6">{children}</main>
      </body>
    </html>
  );
}
