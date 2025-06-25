"use client";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { LogoutButton } from "./LogoutButton";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  return (
    <nav className="bg-blue-700 text-white shadow-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-2xl tracking-tight bg-yellow-400 text-blue-900 px-3 py-1 rounded-lg shadow-sm">JawaLingo</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/dictionary" className="hover:text-yellow-400 font-semibold transition">Dictionary</Link>
        <Link href="/quiz" className="hover:text-yellow-400 font-semibold transition">Quiz</Link>
        <Link href="/leaderboard" className="hover:text-yellow-400 font-semibold transition">Leaderboard</Link>
        {user && <div className="ml-4"><LogoutButton /></div>}
      </div>
    </nav>
  );
}; 