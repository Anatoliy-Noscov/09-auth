import Image from "next/image";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import { Metadata } from "next";
import { getServerUser } from "../../../lib/api/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "User Profile",
    description: "View and manage your profile",
  };
}

export default async function ProfilePage() {
  const user = await getServerUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
