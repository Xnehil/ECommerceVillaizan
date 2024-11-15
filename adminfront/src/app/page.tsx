"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { stat } from "fs";

function checkIfAuthenticated(session: any, status: string) {
  if (status !== "loading") {
    return session?.user?.id ? true : false;
  }
  return false;
}

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    /*

  useEffect(() => {
    console.log("session: ", session);
    console.log("status: ", status);
    if (checkIfAuthenticated(session, status)) {
      setIsAuthenticated(true);
      console.log("User is authenticated");
      console.log("user id: ", session?.user?.id);
    } else {
      setIsAuthenticated(false);
      console.log("User is not authenticated");
      console.log("user id: ", session?.user?.id);
    }
  }, [session, status]);

  useEffect(() => {
    if(status === "loading") {
      return;
    }
    if (isAuthenticated) {
      router.push("/productos");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, status]);
  */

  useEffect(() => {
  //   const isAuthenticated = Cookies.get("auth-token");

  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   } else {
      //console.log("Redirecting to productos");
      router.push("/productos"); // Redirect to productos after login
  //   }
  }, [router]);

  return null; // No UI needed
}
