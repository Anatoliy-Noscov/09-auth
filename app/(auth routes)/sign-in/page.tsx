"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store/authStore";
import { login } from "../../../lib/api/clientApi";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      const session = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (!session.ok) throw new Error("Failed to fetch user session");

      const user = await session.json();

      const adaptedUser = {
        name: user.username,
        email: user.email,
        avatarURL: user.avatar ?? "/default-avatar.png",
      };

      setUser(adaptedUser);
      toast.success("Successfully logged in!");
      router.push("/profile");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Check your credentials.");
      toast.error("Login failed");
      clearIsAuthenticated();
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
