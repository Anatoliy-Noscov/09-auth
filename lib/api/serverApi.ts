import { api } from "../../app/api/api";
import { User } from "../../types/user";
import { Note } from "../../types/note";

export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get("/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

export async function fetchNoteById(id: number): Promise<Note | undefined> {
  try {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
  } catch {
    return undefined;
  }
}
