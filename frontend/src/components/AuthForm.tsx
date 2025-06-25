"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setIsLoading(false);
      onAuthSuccess?.();
    } catch (err: unknown) {
      let message = "Authentication failed";
      if (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        message = (err as { message: string }).message;
      }
      setError(message);
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((v) => !v);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full mx-auto mt-12 flex flex-col gap-6 border border-blue-100"
    >
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">
        {isRegister ? "Daftar Akaun" : "Log Masuk"}
      </h2>
      <input
        type="email"
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
      />
      <input
        type="password"
        className="border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Kata Laluan"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm text-center">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Sila tunggu..." : isRegister ? "Daftar" : "Log Masuk"}
      </button>
      <button
        type="button"
        className="text-blue-600 hover:underline text-sm mt-2"
        onClick={toggleMode}
      >
        {isRegister ? "Sudah ada akaun? Log Masuk" : "Belum ada akaun? Daftar"}
      </button>
    </form>
  );
}; 