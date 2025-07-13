import { api } from "../../app/api/api";
import { CreateNoteValues, FetchNotesValues, Note } from "@/types/note";
import { LogInUser, User } from "../../types/user";
import { toast } from "react-hot-toast";

export async function register(data: User) {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: User) {
  const response = await api.post<LogInUser>("/auth/login", data);
  return response.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function fetchNotes(
  search: string,
  page: number,
  tag: string | undefined
): Promise<FetchNotesValues | undefined> {
  try {
    const params = {
      search: search?.trim() || undefined,
      tag: tag?.trim() || undefined,
      page,
      perPage: 12,
    };

    const res = await api.get<FetchNotesValues>("/notes", { params });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createNote(
  data: CreateNoteValues
): Promise<Note | undefined> {
  try {
    const res = await api.post<Note>("/notes", data);
    return res.data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

export async function deleteNote(id: number): Promise<Note | undefined> {
  try {
    const res = await api.delete<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error));
    return undefined;
  }
}
