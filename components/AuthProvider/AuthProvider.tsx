"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession } from "../../lib/api/clientApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const user = await checkSession();
        setUser(user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
        router.push("/sign-in");
      }
    }
    verifyAuth();
  }, [setUser, setIsAuthenticated, router]);

  return <>{children}</>;
}
