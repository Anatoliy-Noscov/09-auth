"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession } from "../../lib/api/serverApi";
import Loader from "../../app/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUser, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function verifySession() {
      try {
        const session = await checkSession();
        if (session) {
          setUser(session);
          setIsAuthenticated(true);
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [router, setIsAuthenticated, setUser]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
