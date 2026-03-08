"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {

  const router = useRouter();

  const handleLogin = async () => {
    try {

      const user = await signInWithGoogle();

      console.log("Logged in:", user.displayName);

      router.push("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow text-center">

        <h1 className="text-2xl font-bold mb-6">
          Spreadsheet Clone
        </h1>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>

      </div>

    </div>

  );
}