"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Evita render inicial

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/"); // Redirige sin historial
    } else {
      setIsLoading(false); // Token válido, muestra children
    }
  }, [router]);

  if (isLoading) return null; // No renderiza nada hasta saber si hay token

  return children;
}
