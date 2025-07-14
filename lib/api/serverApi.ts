import { api } from "../../app/api/api";
import { cookies } from "next/headers";
import { Note } from "../../types/note";
import { UserResponse } from "../../types/user";

export async function getServerUser(): Promise<UserResponse | null> {
  const cookieStore = cookies();

  try {
    const response = await api.get<UserResponse>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function getServerNote(id: string): Promise<Note | null> {
  const cookieStore = cookies();

  try {
    const response = await api.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch {
    return null;
  }
}
