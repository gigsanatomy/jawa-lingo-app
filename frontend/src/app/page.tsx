"use client";
import { AuthForm } from "@/components/AuthForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function HomePage() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!user) return <AuthForm />;

  return (
    <div className="flex flex-col items-center gap-8 mt-12">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Selamat Datang ke JawaLingo!</h1>
        <p className="text-lg text-blue-900 mb-4">Platform pembelajaran Bahasa Jawa moden dan interaktif.</p>
        <div className="flex flex-col gap-4 mt-6">
          <Link href="/dictionary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition text-lg">Mulakan Belajar (Dictionary)</Link>
          <Link href="/quiz" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 rounded-lg transition text-lg">Quiz Interaktif</Link>
          <Link href="/leaderboard" className="bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 font-bold py-3 rounded-lg transition text-lg">Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}
