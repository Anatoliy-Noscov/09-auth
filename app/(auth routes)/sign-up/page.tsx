"use client";

import css from "./SignUpPage.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store/authStore";
import { register } from "../../../lib/api/clientApi";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { UserCredentials } from "../../../types/user";

export default function SignUpPage() {
  const router = useRouter();
  const { setIsAuthenticated, setUser } = useAuthStore();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const credentials: UserCredentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const user = await register(credentials);
      setUser(user);
      setIsAuthenticated(true);
      router.push("/profile");
    } catch {
      setError("Registration failed");
      toast.error("Registration failed");
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign up</h1>
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
            Register
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
