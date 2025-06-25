"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { DictionaryForm } from "@/components/DictionaryForm";
import { DictionaryList } from "@/components/DictionaryList";

export default function DictionaryPage() {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (!user) return <div className="text-center mt-12 text-blue-700 font-bold">Sila log masuk untuk akses kamus.</div>;
  return (
    <div className="flex flex-col gap-8">
      <DictionaryForm />
      <DictionaryList />
    </div>
  );
} 