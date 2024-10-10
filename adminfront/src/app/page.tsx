"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
  //   const isAuthenticated = Cookies.get("auth-token");

  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   } else {
      router.push("/productos"); // Redirect to productos after login
  //   }
  }, [router]);

  return null; // No UI needed
}
