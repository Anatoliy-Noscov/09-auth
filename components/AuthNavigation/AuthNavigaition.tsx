"use client";

import Link from "next/link";
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "../../lib/store/authStore";
import { logout } from "../../lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useAuthStore();

  async function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
