"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout?.();
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
    >
      Log Keluar
    </button>
  );
}; 