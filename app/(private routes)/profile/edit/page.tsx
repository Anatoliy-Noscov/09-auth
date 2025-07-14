"use client";

import css from "../ProfilePage.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../lib/store/authStore";
import {
  updateUserProfile,
  getCurrentUser,
} from "../../../../lib/api/clientApi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUsername(currentUser.username);
      } catch {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const updatedUser = await updateUserProfile({ username });
      setUser(updatedUser);
      toast.success("Profile updated");
      router.push("/profile");
    } catch {
      toast.error("Failed to update profile");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <p>Email: {user?.email}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
